import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    // Update user subscription status
    const payment = await prisma.payment.findUnique({
      where: { orderId: razorpay_order_id },
      include: { user: true },
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    // Set plan end date to 30 days from now
    const planEndDate = new Date();
    planEndDate.setDate(planEndDate.getDate() + 30);

    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        plan: payment.planType,
        planEndDate: planEndDate
      },
    });

    await prisma.payment.update({
      where: { orderId: razorpay_order_id },
      data: {
        status: "completed",
        paymentId: razorpay_payment_id,
      },
    });

    return NextResponse.json({ 
      message: "Payment verified successfully",
      plan: payment.planType,
      planEndDate
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
