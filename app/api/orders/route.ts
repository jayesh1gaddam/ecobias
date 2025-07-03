import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"
import { UserService } from "@/lib/services/userService"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const orderService = new OrderService()
    const userService = new UserService()

    let orders
    if (userId) {
      orders = await orderService.getOrdersByUserId(userId)
    } else {
      orders = await orderService.getAllOrders()
    }

    // Attach user info (name, email, phone) to each order
    const userIds = Array.from(new Set(orders.map((o: any) => o.userId?.toString()).filter(Boolean)))
    const users = userIds.length > 0 ? await userService.getAllUsers() : []
    const userMap = Object.fromEntries(users.map((u: any) => [u._id?.toString(), u]))
    orders = orders.map((o: any) => ({
      ...o,
      user: o.userId ? {
        name: userMap[o.userId?.toString()]?.name || "",
        email: userMap[o.userId?.toString()]?.email || "",
        phone: userMap[o.userId?.toString()]?.phone || "",
      } : {},
    }))

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, subtotal, shipping, tax, total, shippingAddress, razorpayOrderId } = body

    const orderService = new OrderService()

    const order = await orderService.createOrder({
      userId: new ObjectId(userId),
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      razorpayOrderId,
    })

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
