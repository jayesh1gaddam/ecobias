import { getDatabase } from "@/lib/mongodb"
import type { SubAdmin, CreateSubAdminData } from "@/lib/models/SubAdmin"
import type { CouponCode, CreateCouponData } from "@/lib/models/CouponCode"
import { ObjectId, type Collection } from "mongodb"
import bcrypt from "bcryptjs"

export class SubAdminService {
  private async getSubAdminCollection(): Promise<Collection<SubAdmin>> {
    const db = await getDatabase()
    return db.collection<SubAdmin>("subadmins")
  }

  private async getCouponCollection(): Promise<Collection<CouponCode>> {
    const db = await getDatabase()
    return db.collection<CouponCode>("coupons")
  }

  async createSubAdmin(subAdminData: CreateSubAdminData): Promise<SubAdmin> {
    const collection = await this.getSubAdminCollection()

    // Check if username already exists
    const existingUser = await collection.findOne({ username: subAdminData.username })
    if (existingUser) {
      throw new Error("Sub-admin with this username already exists")
    }

    // Check if coupon code already exists
    const existingCoupon = await this.getCouponByCode(subAdminData.couponCode)
    if (existingCoupon) {
      throw new Error("This coupon code is already assigned")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(subAdminData.password, 12)

    const subAdmin: Omit<SubAdmin, "_id"> = {
      ...subAdminData,
      password: hashedPassword,
      role: "sub-admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(subAdmin)
    const createdSubAdmin = { ...subAdmin, _id: result.insertedId }

    // Create coupon code entry
    await this.createCoupon({
      code: subAdminData.couponCode,
      subAdminId: result.insertedId,
    })

    return createdSubAdmin
  }

  async authenticateSubAdmin(username: string, password: string): Promise<SubAdmin | null> {
    const collection = await this.getSubAdminCollection()
    const subAdmin = await collection.findOne({ username, isActive: true })

    if (!subAdmin) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, subAdmin.password)
    if (!isPasswordValid) {
      return null
    }

    return subAdmin
  }

  async getSubAdminById(id: string): Promise<SubAdmin | null> {
    const collection = await this.getSubAdminCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getSubAdminByCoupon(couponCode: string): Promise<SubAdmin | null> {
    const collection = await this.getSubAdminCollection()
    return await collection.findOne({ couponCode, isActive: true })
  }

  async getAllSubAdmins(): Promise<SubAdmin[]> {
    const collection = await this.getSubAdminCollection()
    return await collection.find({}).toArray()
  }

  async createCoupon(couponData: CreateCouponData): Promise<CouponCode> {
    const collection = await this.getCouponCollection()

    const coupon: Omit<CouponCode, "_id"> = {
      ...couponData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(coupon)
    return { ...coupon, _id: result.insertedId }
  }

  async getCouponByCode(code: string): Promise<CouponCode | null> {
    const collection = await this.getCouponCollection()
    return await collection.findOne({ code, isActive: true })
  }

  async validateCoupon(code: string): Promise<boolean> {
    const coupon = await this.getCouponByCode(code)
    return coupon !== null
  }

  async getAllCoupons(): Promise<CouponCode[]> {
    const collection = await this.getCouponCollection()
    return await collection.find({ isActive: true }).toArray()
  }

  async deactivateSubAdmin(id: string): Promise<SubAdmin | null> {
    const collection = await this.getSubAdminCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result || !(result as any).value) {
      return null
    }
    return (result as any).value
  }
}
