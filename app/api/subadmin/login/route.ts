import { type NextRequest, NextResponse } from "next/server"
import { SubAdminService } from "@/lib/services/subAdminService"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const subAdminService = new SubAdminService()
    const subAdmin = await subAdminService.authenticateSubAdmin(username, password)

    if (!subAdmin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...subAdminWithoutPassword } = subAdmin

    return NextResponse.json({
      success: true,
      message: "Login successful",
      subAdmin: subAdminWithoutPassword,
    })
  } catch (error) {
    console.error("Sub-admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
