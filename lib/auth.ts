"use client"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  isPremium: boolean
  membershipExpiry?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  role: "user" | "admin"
  createdAt: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User): void {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logout(): void {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("cart")
  window.location.href = "/login"
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isPremiumMember(): boolean {
  const user = getCurrentUser()
  if (!user || !user.isPremium) return false

  if (user.membershipExpiry) {
    const expiry = new Date(user.membershipExpiry)
    return expiry > new Date()
  }

  return false
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export function requireAuth(): User | null {
  const user = getCurrentUser()
  if (!user) {
    window.location.href = "/login"
    return null
  }
  return user
}

export function requireAdmin(): User | null {
  const user = requireAuth()
  if (!user) return null

  if (!isAdmin()) {
    window.location.href = "/store"
    return null
  }

  return user
}

export function requirePremium(): User | null {
  const user = requireAuth()
  if (!user) return null

  if (!isPremiumMember()) {
    window.location.href = "/membership"
    return null
  }

  return user
}
