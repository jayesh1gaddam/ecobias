import { NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"
import { promises as fs } from "fs"
import path from "path"
import formidable from "formidable"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  // Parse multipart form data
  const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true })
  const req = (request as any).req || request;
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })

  const orderId = fields.orderId as string
  const file = files.screenshot

  if (!orderId || !file) {
    return NextResponse.json({ error: "Order ID and screenshot are required" }, { status: 400 })
  }

  // Save the file path (relative to public) in the DB
  const screenshotUrl = `/uploads/${path.basename(file.filepath || file.path)}`
  const orderService = new OrderService()
  const order = await orderService.uploadPaymentScreenshot(orderId, screenshotUrl)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    message: "Payment screenshot uploaded successfully",
    order,
  })
} 