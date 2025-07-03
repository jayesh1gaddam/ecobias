import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { ObjectId } from "mongodb"
import { UserService } from "@/lib/services/userService"
import { OrderService } from "@/lib/services/orderService"
import { ProductService } from "@/lib/services/productService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      order_type, // 'membership' or 'product'
      order_details,
    } = body

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex")

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Payment is verified, now process the order
    if (order_type === "membership") {
      // Handle membership upgrade
      await processMembershipUpgrade(user_id, {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: order_details.amount,
        duration_months: order_details.duration_months,
      })
    } else if (order_type === "product") {
      // Handle product order
      await processProductOrder(user_id, {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        items: order_details.items,
        total_amount: order_details.total_amount,
        subtotal: order_details.subtotal,
        shipping: order_details.shipping,
        tax: order_details.tax,
        shipping_address: order_details.shipping_address,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}

async function processMembershipUpgrade(userId: string, paymentDetails: any) {
  try {
    const userService = new UserService()

    // Calculate membership expiry (12 months from now)
    const membershipExpiry = new Date()
    membershipExpiry.setMonth(membershipExpiry.getMonth() + paymentDetails.duration_months)

    // Update user's premium status
    await userService.upgradeToPremium(userId, membershipExpiry)

    console.log("Membership upgrade processed for user:", userId)
  } catch (error) {
    console.error("Error processing membership upgrade:", error)
    throw error
  }
}

async function processProductOrder(userId: string, orderDetails: any) {
  try {
    const orderService = new OrderService()
    const productService = new ProductService()

    // Create order in database
    const order = await orderService.createOrder({
      userId: new ObjectId(userId),
      items: orderDetails.items,
      subtotal: orderDetails.subtotal,
      shipping: orderDetails.shipping,
      tax: orderDetails.tax,
      total: orderDetails.total_amount,
      shippingAddress: orderDetails.shipping_address,
      razorpayOrderId: orderDetails.order_id,
    })

    // Update order with payment details
    await orderService.updateOrderPayment(orderDetails.order_id, orderDetails.payment_id, "confirmed")

    // Update product stock
    for (const item of orderDetails.items) {
      await productService.updateStock(item.id, item.quantity)
    }

    console.log("Product order processed:", order.orderNumber)
  } catch (error) {
    console.error("Error processing product order:", error)
    throw error
  }
}
