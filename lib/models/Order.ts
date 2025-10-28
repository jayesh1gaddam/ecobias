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
  couponCode: string // Coupon code: MANDATORY for premium products, optional for regular products and membership
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  // Optional precise location captured at order placement time
  orderLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
    capturedAt?: Date
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
  couponCode: string // Coupon code for order assignment (required for premium products)
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orderLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
    capturedAt?: Date
  }
}
