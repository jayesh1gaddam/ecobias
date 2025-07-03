import { NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"
import { ProductService } from "@/lib/services/productService"

export async function GET() {
  try {
    const orderService = new OrderService()
    const productService = new ProductService()

    // Get all orders and products
    const [orders, products] = await Promise.all([
      orderService.getAllOrders(),
      productService.getAllProducts(),
    ])

    // Total sales and orders
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalOrders = orders.length
    const totalProducts = products.length

    // Sales per month (last 6 months)
    const now = new Date()
    const salesData = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const monthOrders = orders.filter(o => {
        const d = new Date(o.createdAt)
        return d >= month && d < nextMonth
      })
      const monthSales = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      salesData.push({
        month: month.toLocaleString("default", { month: "short" }),
        sales: monthSales,
      })
    }

    return NextResponse.json({
      success: true,
      totalSales,
      totalOrders,
      totalProducts,
      salesData,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
} 