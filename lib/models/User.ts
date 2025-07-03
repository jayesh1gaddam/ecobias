import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  password: string
  isPremium: boolean
  membershipExpiry?: Date
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  name: string
  email: string
  phone: string
  password: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  role?: "user" | "admin"
}
