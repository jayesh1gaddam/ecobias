import type { ObjectId } from "mongodb"

export interface OrderItem {
  productId: ObjectId
  name: string
  brand: string
  price: number
  quantity: number
  image: string
  isPremium?: boolean
}

export interface Order {
  _id?: ObjectId
  userId: ObjectId
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "payment_pending" | "payment_verified" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "upi_qr"
  paymentScreenshot?: string // URL to uploaded screenshot
  paymentVerified: boolean
  paymentVerifiedBy?: string // Admin ID who verified
  paymentVerifiedAt?: Date
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderData {
  userId: ObjectId
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}
