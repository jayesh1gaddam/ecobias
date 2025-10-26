import { type NextRequest, NextResponse } from "next/server"
import { SubAdminService } from "@/lib/services/subAdminService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { couponCode } = body

    if (!couponCode) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    const subAdminService = new SubAdminService()
    const isValid = await subAdminService.validateCoupon(couponCode.toUpperCase())

    if (!isValid) {
      return NextResponse.json({
        valid: false,
        error: "Invalid coupon code"
      }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      message: "Coupon code is valid",
    })
  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}
