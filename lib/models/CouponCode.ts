import type { ObjectId } from "mongodb"

export interface CouponCode {
  _id?: ObjectId
  code: string // unique coupon code (e.g., "PERFUME2025A")
  subAdminId: ObjectId // reference to sub-admin who owns this coupon
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCouponData {
  code: string
  subAdminId: ObjectId
}
