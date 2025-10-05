import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"
import { OrderService } from "@/lib/services/orderService"

export async function GET(request: NextRequest) {
  try {
    const userService = new UserService()
    const orderService = new OrderService()

    const users = await userService.getAllUsers()

    // Build a map of userId -> latest order location (if any)
    const userIdToLocation: Record<string, any> = {}
    const allOrders = await orderService.getAllOrders()
    for (const order of allOrders) {
      const uid = order.userId?.toString()
      if (!uid) continue
      const current = userIdToLocation[uid]
      if (!current) {
        userIdToLocation[uid] = { orderLocation: order.orderLocation, createdAt: order.createdAt }
      } else {
        // Keep the most recent
        if (order.createdAt > current.createdAt) {
          userIdToLocation[uid] = { orderLocation: order.orderLocation, createdAt: order.createdAt }
        }
      }
    }

    const sanitized = users.map((u: any) => {
      const { password, ...rest } = u
      return {
        ...rest,
        latestOrderLocation: userIdToLocation[u._id?.toString()]?.orderLocation || null,
      }
    })

    return NextResponse.json({ success: true, users: sanitized })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}


