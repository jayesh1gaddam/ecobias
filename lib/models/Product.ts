import type { ObjectId } from "mongodb"

export interface Product {
  _id?: ObjectId
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  description: string
  inStock: boolean
  stockQuantity: number
  isNew?: boolean
  isBestseller?: boolean
  isPremium?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductData {
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  stockQuantity: number
  isNew?: boolean
  isBestseller?: boolean
  isPremium?: boolean
}
