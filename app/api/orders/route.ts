import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { OrderService } from "@/lib/services/orderService"

export async function GET(request: NextRequest) {
  try {
    const orderService = new OrderService()
    const orders = await orderService.getAllOrders()

    // Populate user details for each order
    const ordersWithUserDetails = await Promise.all(
      orders.map(async (order) => {
        const { UserService } = await import("@/lib/services/userService")
        const userService = new UserService()
        const user = await userService.getUserById(order.userId.toString())
        
        return {
          _id: order._id,
          user: user ? {
            name: user.name,
            email: user.email,
            phone: user.phone,
          } : null,
          items: order.items,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          shippingAddress: order.shippingAddress,
          orderLocation: order.orderLocation,
          paymentScreenshot: order.paymentScreenshot,
          paymentVerified: order.paymentVerified,
          paymentVerifiedBy: order.paymentVerifiedBy,
          paymentVerifiedAt: order.paymentVerifiedAt,
        }
      })
    )

    return NextResponse.json({
      success: true,
      orders: ordersWithUserDetails,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, subtotal, shipping, tax, total, shippingAddress } = body

    // Require a valid shipping address for all orders (product or membership)
    if (!shippingAddress ||
        typeof shippingAddress.street !== "string" || shippingAddress.street.trim() === "" ||
        typeof shippingAddress.city !== "string" || shippingAddress.city.trim() === "" ||
        typeof shippingAddress.state !== "string" || shippingAddress.state.trim() === "" ||
        typeof shippingAddress.zipCode !== "string" || shippingAddress.zipCode.trim() === "" ||
        typeof shippingAddress.country !== "string" || shippingAddress.country.trim() === "") {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    const orderService = new OrderService()

    const order = await orderService.createOrder({
      userId: new ObjectId(userId),
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
    })

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    // Return the error message in the response for debugging
    return NextResponse.json({ error: "Failed to create order", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const orderService = new OrderService()
    const order = await orderService.updateOrderStatus(id, status)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order,
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
