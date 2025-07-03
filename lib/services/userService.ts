import { getDatabase } from "@/lib/mongodb"
import type { User, CreateUserData } from "@/lib/models/User"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export class UserService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<User>("users")
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const collection = await this.getCollection()

    // Check if user already exists
    const existingUser = await collection.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const user: Omit<User, "_id"> = {
      ...userData,
      password: hashedPassword,
      isPremium: false,
      role: userData.role || "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const collection = await this.getCollection()
    const user = await collection.findOne({ email })

    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    return user
  }

  async getUserById(id: string): Promise<User | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
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

  async upgradeToPremium(id: string, membershipExpiry: Date): Promise<User | null> {
    return await this.updateUser(id, {
      isPremium: true,
      membershipExpiry,
    })
  }

  async getAllUsers(): Promise<User[]> {
    const collection = await this.getCollection()
    return await collection.find({}).toArray()
  }
}
