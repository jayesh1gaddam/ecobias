import { getDatabase } from "@/lib/mongodb"
import type { StoreSettings } from "@/lib/models/StoreSettings"

export class StoreService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<StoreSettings>("store_settings")
  }

  async getStoreSettings(): Promise<StoreSettings | null> {
    const collection = await this.getCollection()
    return await collection.findOne({})
  }

  async updateStoreSettings(settings: Omit<StoreSettings, "_id" | "updatedAt">): Promise<StoreSettings> {
    const collection = await this.getCollection()

    const storeSettings: Omit<StoreSettings, "_id"> = {
      ...settings,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate(
      {},
      { $set: storeSettings },
      { upsert: true, returnDocument: "after" },
    )

    return result.value!
  }

  async seedStoreSettings(): Promise<void> {
    const collection = await this.getCollection()
    const count = await collection.countDocuments()

    if (count === 0) {
      const defaultSettings: Omit<StoreSettings, "_id"> = {
        name: "Luxury Perfumes",
        address: "123 Fragrance Street, Perfume City, PC 12345",
        phone: "+1 (555) 123-4567",
        email: "info@luxuryperfumes.com",
        hours: {
          monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
          saturday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
          sunday: { isOpen: false, openTime: "10:00", closeTime: "17:00" },
        },
        updatedAt: new Date(),
      }

      await collection.insertOne(defaultSettings)
    }
  }
}
