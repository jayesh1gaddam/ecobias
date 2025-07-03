import type { ObjectId } from "mongodb"

export interface StoreHours {
  isOpen: boolean
  openTime: string
  closeTime: string
}

export interface StoreSettings {
  _id?: ObjectId
  name: string
  address: string
  phone: string
  email: string
  hours: {
    monday: StoreHours
    tuesday: StoreHours
    wednesday: StoreHours
    thursday: StoreHours
    friday: StoreHours
    saturday: StoreHours
    sunday: StoreHours
  }
  updatedAt: Date
}
