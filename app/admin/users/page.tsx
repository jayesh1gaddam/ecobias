"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User } from "lucide-react"

interface UserItem {
  _id: string
  name: string
  email: string
  phone: string
  isPremium?: boolean
  role?: string
  latestOrderLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
    capturedAt?: string
  } | null
  userLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
    capturedAt?: string
  } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/users")
        const data = await res.json()
        if (data.success) setUsers(data.users)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registered Users</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">User</th>
                    <th className="p-2">Contact</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Premium</th>
                    <th className="p-2">Latest Order Location</th>
                    <th className="p-2">Registration Location</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{u.name || "-"}</div>
                            <div className="text-xs text-gray-500">{u._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-gray-700">
                          <div>{u.email}</div>
                          <div>{u.phone}</div>
                        </div>
                      </td>
                      <td className="p-2">{u.role || "user"}</td>
                      <td className="p-2">{u.isPremium ? <Badge className="bg-purple-600 text-white">Premium</Badge> : <Badge variant="secondary">Standard</Badge>}</td>
                      <td className="p-2">
                        {u.latestOrderLocation ? (
                          <div className="text-xs text-gray-700">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {u.latestOrderLocation.latitude.toFixed(5)}, {u.latestOrderLocation.longitude.toFixed(5)}</div>
                            {u.latestOrderLocation.accuracy !== undefined && (
                              <div>±{Math.round(u.latestOrderLocation.accuracy)} m</div>
                            )}
                            {u.latestOrderLocation.capturedAt && (
                              <div>{new Date(u.latestOrderLocation.capturedAt).toLocaleString()}</div>
                            )}
                            <a
                              href={`https://www.google.com/maps?q=${u.latestOrderLocation.latitude},${u.latestOrderLocation.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open in Maps
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">No data</span>
                        )}
                      </td>
                      <td className="p-2">
                        {u.userLocation ? (
                          <div className="text-xs text-gray-700">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {u.userLocation.latitude.toFixed(5)}, {u.userLocation.longitude.toFixed(5)}</div>
                            {u.userLocation.accuracy !== undefined && (
                              <div>±{Math.round(u.userLocation.accuracy)} m</div>
                            )}
                            {u.userLocation.capturedAt && (
                              <div>{new Date(u.userLocation.capturedAt).toLocaleString()}</div>
                            )}
                            <a
                              href={`https://www.google.com/maps?q=${u.userLocation.latitude},${u.userLocation.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open in Maps
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">No data</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


