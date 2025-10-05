import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, address, userLocation } = body

    // Validate required fields
    if (!name || !email || !phone || !password || !address) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }
    // Require geolocation at registration
    if (!userLocation || typeof userLocation.latitude !== "number" || typeof userLocation.longitude !== "number") {
      return NextResponse.json({ error: "Location permission is required to register" }, { status: 400 })
    }

    const userService = new UserService()
    const user = await userService.createUser({
      name,
      email,
      phone,
      password,
      address,
      userLocation,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error && error.message === "User with this email already exists") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
