"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Truck, PackageCheck, X } from "lucide-react"

interface Order {
  _id: string
  user: { name: string; email: string; phone: string }
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: string
  createdAt: string
  paymentId?: string
}

const STATUS = ["pending", "shipped", "delivered"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data.success) setOrders(data.orders)
      else setError("Failed to load orders")
    } catch (e) {
      setError("Failed to load orders")
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) fetchOrders()
    } catch {}
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
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
                    <th className="p-2">Phone</th>
                    <th className="p-2">Items</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Payment</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Created</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b">
                      <td className="p-2">{o.user?.name || "-"}<br /><span className="text-xs text-gray-500">{o.user?.email}</span></td>
                      <td className="p-2">{o.user?.phone || "-"}</td>
                      <td className="p-2">
                        {o.items.map((item, i) => (
                          <div key={i}>{item.name} × {item.quantity}</div>
                        ))}
                      </td>
                      <td className="p-2">₹{o.total}</td>
                      <td className="p-2">
                        {o.paymentId ? (
                          <Badge className="bg-green-500 text-white">Paid</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">Unpaid</Badge>
                        )}
                      </td>
                      <td className="p-2">
                        <Badge className="bg-[var(--color-accent)] text-white">{o.status}</Badge>
                      </td>
                      <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="p-2 space-x-2">
                        {STATUS.filter(s => s !== o.status).map(s => (
                          <Button key={s} size="sm" variant="outline" onClick={() => updateStatus(o._id, s)}>
                            {s === "shipped" && <Truck className="h-4 w-4" />}
                            {s === "delivered" && <PackageCheck className="h-4 w-4" />}
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </Button>
                        ))}
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