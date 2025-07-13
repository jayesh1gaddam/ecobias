import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, adminId, action } = body // action: "verify" or "reject"

    if (!orderId || !adminId || !action) {
      return NextResponse.json({ error: "Order ID, admin ID, and action are required" }, { status: 400 })
    }

    if (!["verify", "reject"].includes(action)) {
      return NextResponse.json({ error: "Action must be 'verify' or 'reject'" }, { status: 400 })
    }

    const orderService = new OrderService()
    let order

    if (action === "verify") {
      order = await orderService.verifyPayment(orderId, adminId)
    } else {
      order = await orderService.rejectPayment(orderId, adminId)
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${action === "verify" ? "verified" : "rejected"} successfully`,
      order,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
} 