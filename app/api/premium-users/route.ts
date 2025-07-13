import { NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

// Helper to check admin (for demo: expects { admin: true } in body or header)
async function isAdmin(request: NextRequest): Promise<boolean> {
  // In production, use proper authentication (e.g., JWT, session, etc.)
  const authHeader = request.headers.get("x-admin-auth")
  if (authHeader === "true") return true
  try {
    const body = await request.json()
    if (body && body.admin === true) return true
  } catch {}
  return false
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userService = new UserService()
  const users = await userService.getPremiumUsers()
  // Remove sensitive info
  const safeUsers = users.map(({ password, ...u }) => u)
  return NextResponse.json({ success: true, users: safeUsers })
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { userId } = await request.json()
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  const userService = new UserService()
  const user = await userService.revokePremiumStatus(userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, user })
} 