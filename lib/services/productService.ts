import { getDatabase } from "@/lib/mongodb"
import type { Product, CreateProductData } from "@/lib/models/Product"
import { ObjectId } from "mongodb"

export class ProductService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Product>("products")
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const collection = await this.getCollection()

    const product: Omit<Product, "_id"> = {
      ...productData,
      rating: 0,
      reviewCount: 0,
      inStock: productData.stockQuantity > 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(product)
    return { ...product, _id: result.insertedId }
  }

  async getAllProducts(): Promise<Product[]> {
    const collection = await this.getCollection()
    return await collection.find({}).toArray()
  }

  async getProductById(id: string): Promise<Product | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async deleteProduct(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { stockQuantity: -quantity },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    if (result.value) {
      // Update inStock status
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: { inStock: result.value.stockQuantity > 0 } })
    }

    return result.value
  }

  async seedProducts(): Promise<void> {
    const collection = await this.getCollection()
    const count = await collection.countDocuments()

    if (count === 0) {
      const sampleProducts: CreateProductData[] = [
        {
          name: "Chanel No. 5 Eau de Parfum",
          brand: "Chanel",
          price: 8500,
          originalPrice: 9500,
          image: "/images/chanel-no5.jpg",
          category: "Women",
          description:
            "The world's most iconic fragrance. A timeless floral aldehyde with notes of ylang-ylang, rose, and sandalwood.",
          stockQuantity: 50,
          isBestseller: true,
        },
        {
          name: "Chanel Gabrielle Eau de Parfum",
          brand: "Chanel",
          price: 9200,
          originalPrice: 10500,
          image: "/images/chanel-gabrielle.jpg",
          category: "Women",
          description:
            "A luminous fragrance that radiates the four white flowers: jasmine, ylang-ylang, orange blossom, and tuberose.",
          stockQuantity: 35,
          isBestseller: true,
        },
        {
          name: "Atkinsons The Big Bad Cedar",
          brand: "Atkinsons",
          price: 12500,
          image: "/images/atkinsons-cedar.jpg",
          category: "Men",
          description: "A bold and sophisticated woody fragrance with cedar, vetiver, and spicy notes.",
          stockQuantity: 20,
          isNew: true,
        },
        {
          name: "Guerlain Aqua Allegoria Pera Granita",
          brand: "Guerlain",
          price: 7800,
          image: "/images/guerlain-aqua.jpg",
          category: "Unisex",
          description: "A fresh and fruity fragrance with pear, bergamot, and white musk notes.",
          stockQuantity: 40,
          isNew: true,
        },
        {
          name: "Dolce & Gabbana The One",
          brand: "Dolce & Gabbana",
          price: 6500,
          originalPrice: 7500,
          image: "/images/dolce-gabbana.jpg",
          category: "Women",
          description: "An elegant oriental floral with lychee, white flower, and vanilla notes.",
          stockQuantity: 30,
          isBestseller: true,
        },
        {
          name: "Tom Ford Oud Wood Premium",
          brand: "Tom Ford",
          price: 25999,
          image: "/images/guerlain-sequin.jpg",
          category: "Unisex",
          description: "An exclusive premium blend with rare oud wood, rosewood, and exotic spices.",
          stockQuantity: 10,
          isNew: true,
          isPremium: true,
        },
        {
          name: "Creed Royal Oud Limited Edition",
          brand: "Creed",
          price: 35999,
          image: "/images/perfume-hero.jpg",
          category: "Unisex",
          description: "A luxurious limited edition fragrance with royal oud and precious ingredients.",
          stockQuantity: 5,
          isPremium: true,
        },
        {
          name: "Marc Jacobs Daisy Collection",
          brand: "Marc Jacobs",
          price: 4500,
          originalPrice: 5500,
          image: "/images/perfume-collection.jpg",
          category: "Women",
          description: "A charming collection of whimsical fragrances with a youthful, fresh spirit.",
          stockQuantity: 25,
          isNew: true,
        },
      ]

      for (const productData of sampleProducts) {
        await this.createProduct(productData)
      }
    }
  }
}
