import type { ObjectId } from "mongodb"

export interface SubAdmin {
  _id?: ObjectId
  username: string
  password: string // hashed
  name: string
  email: string
  phone: string
  couponCode: string // unique coupon code assigned to this sub-admin
  role: "sub-admin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateSubAdminData {
  username: string
  password: string
  name: string
  email: string
  phone: string
  couponCode: string
}
