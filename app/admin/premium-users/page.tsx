"use client"

import { useEffect, useState } from "react"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  membershipExpiry?: string
  isPremium: boolean
  createdAt: string
  updatedAt: string
}

export default function PremiumUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)

  // Fetch premium users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/premium-users", {
          method: "GET",
          headers: {
            "x-admin-auth": "true", // Replace with real auth in production
          },
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || "Failed to fetch users")
        setUsers(data.users)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Revoke premium
  async function revokePremium(userId: string) {
    if (!window.confirm("Are you sure you want to revoke premium access for this user?")) return
    setRevoking(userId)
    setError(null)
    try {
      const res = await fetch("/api/premium-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "true", // Replace with real auth in production
        },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Failed to revoke premium")
      setUsers(users => users.filter(u => u._id !== userId))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRevoking(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Premium User Management</h1>
      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h2 className="font-semibold mb-2">Instructions</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li>View all current premium users and their membership expiry dates.</li>
          <li>Click "Revoke" to immediately remove premium access from a user.</li>
          <li>Revoked users will lose all premium perks until they purchase again.</li>
          <li>Use this feature responsibly. This action cannot be undone.</li>
        </ul>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading premium users...</div>
      ) : users.length === 0 ? (
        <div>No premium users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">Phone</th>
                <th className="px-3 py-2 border">Expiry</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="px-3 py-2 border">{user.name}</td>
                  <td className="px-3 py-2 border">{user.email}</td>
                  <td className="px-3 py-2 border">{user.phone}</td>
                  <td className="px-3 py-2 border">{user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString() : "-"}</td>
                  <td className="px-3 py-2 border">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={revoking === user._id}
                      onClick={() => revokePremium(user._id)}
                    >
                      {revoking === user._id ? "Revoking..." : "Revoke"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 