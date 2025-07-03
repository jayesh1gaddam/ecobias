import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, receipt, notes } = body

    // Validate required fields
    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    // Create order with Razorpay
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
