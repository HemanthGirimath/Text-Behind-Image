import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'
import type { RazorpayOrder } from '@/types/razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { planType } = body

    if (!planType || !['basic', 'premium'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Check if user is already on the same or higher plan
    if (session.user.plan === 'premium' || 
       (session.user.plan === 'basic' && planType === 'basic')) {
      return NextResponse.json(
        { error: 'You are already subscribed to this plan or a higher tier' },
        { status: 400 }
      )
    }

    const amount = planType === 'basic' ? 900 : 1900 // Amount in INR

    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      }) as unknown as RazorpayOrder

      // Create payment record
      await prisma.payment.create({
        data: {
          userId: session.user.id,
          orderId: order.id,
          amount,
          planType,
          status: 'pending'
        }
      })

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      })
    } catch (error) {
      console.error('Razorpay order creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Razorpay API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { 
      orderId,
      paymentId,
      signature,
      planType
    } = body

    // Verify payment signature
    const text = orderId + '|' + paymentId
    const crypto = require('crypto')
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generated_signature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update user's plan and update payment record
    const planEndDate = new Date()
    planEndDate.setDate(planEndDate.getDate() + 30) // 30 days subscription

    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: {
            plan: planType,
            planStartDate: new Date(),
            planEndDate: planEndDate,
          },
        }),
        prisma.payment.update({
          where: { orderId: orderId },
          data: {
            paymentId,
            status: 'completed'
          }
        })
      ])

      // Force refresh the session to update the plan
      const updatedSession = await getServerSession(authOptions)
      
      return NextResponse.json({ 
        success: true,
        plan: updatedSession?.user.plan 
      })
    } catch (error) {
      console.error('Database transaction error:', error)
      return NextResponse.json(
        { error: 'Failed to update payment and user plan' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 