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
      status: "pending",
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

  async updateOrderStatus(id: string, status: Order["status"], paymentId?: string): Promise<Order | null> {
    const collection = await this.getCollection()

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (paymentId) {
      updateData.paymentId = paymentId
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    )

    return result.value
  }

  async updateOrderPayment(razorpayOrderId: string, paymentId: string, status: Order["status"]): Promise<Order | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { razorpayOrderId },
      {
        $set: {
          paymentId,
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substr(2, 5).toUpperCase()
    return `ORD-${timestamp.slice(-6)}-${random}`
  }
}
