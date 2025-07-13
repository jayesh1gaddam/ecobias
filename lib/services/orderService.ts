import { getDatabase } from "@/lib/mongodb"
import type { Order, CreateOrderData } from "@/lib/models/Order"
import { ObjectId } from "mongodb"

export class OrderService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Order>("orders")
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const collection = await this.getCollection()

    const order: Omit<Order, "_id"> = {
      ...orderData,
      orderNumber: this.generateOrderNumber(),
      status: "payment_pending",
      paymentMethod: "upi_qr",
      paymentVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(order)
    return { ...order, _id: result.insertedId }
  }

  async getOrderById(id: string): Promise<Order | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const collection = await this.getCollection()
    return await collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
  }

  async getAllOrders(): Promise<Order[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
    const collection = await this.getCollection()

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    )

    if (!result || !(result as any).value) {
      return null
    }
    return (result as any).value
  }

  async uploadPaymentScreenshot(orderId: string, screenshotUrl: string): Promise<Order | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentScreenshot: screenshotUrl,
          status: "pending", // Change to pending for admin verification
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

  async verifyPayment(orderId: string, adminId: string): Promise<Order | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentVerified: true,
          paymentVerifiedBy: adminId,
          paymentVerifiedAt: new Date(),
          status: "payment_verified",
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

  async rejectPayment(orderId: string, adminId: string): Promise<Order | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentVerified: false,
          paymentVerifiedBy: adminId,
          paymentVerifiedAt: new Date(),
          status: "payment_pending",
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

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substr(2, 5).toUpperCase()
    return `ORD-${timestamp.slice(-6)}-${random}`
  }
}
