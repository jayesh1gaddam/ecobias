import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity)
        break
      case "order.paid":
        await handleOrderPaid(event.payload.order.entity)
        break
      default:
        console.log("Unhandled webhook event:", event.event)
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log("Payment captured:", payment.id)
  // Update order status, send confirmation emails, etc.
}

async function handlePaymentFailed(payment: any) {
  console.log("Payment failed:", payment.id)
  // Handle failed payment, notify user, etc.
}

async function handleOrderPaid(order: any) {
  console.log("Order paid:", order.id)
  // Process the order, update inventory, etc.
}
