import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const razorpay_order_id = url.searchParams.get('razorpay_order_id')
  const razorpay_payment_id = url.searchParams.get('razorpay_payment_id')
  const razorpay_signature = url.searchParams.get('razorpay_signature')

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=Invalid payment parameters`,
      { status: 303 }
    )
  }

  try {
    // Verify signature
    const text = razorpay_order_id + '|' + razorpay_payment_id
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=Invalid payment signature`,
        { status: 303 }
      )
    }

    // Create a new PrismaClient instance
    const prisma = new PrismaClient()

    try {
      // Find the payment record
      const payment = await prisma.payment.findUnique({
        where: { orderId: razorpay_order_id },
        include: { user: true }
      })

      if (!payment) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=Payment not found`,
          { status: 303 }
        )
      }

      // Update payment status and user plan in a transaction
      await prisma.$transaction([
        prisma.payment.update({
          where: { orderId: razorpay_order_id },
          data: {
            paymentId: razorpay_payment_id,
            status: 'completed'
          }
        }),
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            plan: payment.planType,
            planStartDate: new Date(),
            planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }
        })
      ])

      await prisma.$disconnect()

      // Redirect to success page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?success=true`,
        { status: 303 }
      )
    } catch (error) {
      console.error('Payment callback error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=Payment processing failed`,
        { status: 303 }
      )
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?error=Payment processing failed`,
      { status: 303 }
    )
  }
}

// Also handle POST requests for backward compatibility
export { GET as POST }