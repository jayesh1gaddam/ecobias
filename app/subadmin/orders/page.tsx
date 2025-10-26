"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck, LogOut, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Order {
  _id: string
  user: { name: string; email: string; phone: string }
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: string
  createdAt: string
  couponCode: string
  paymentScreenshot?: string
  paymentVerified: boolean
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orderLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
    capturedAt?: string
  }
}

export default function SubAdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [subAdminData, setSubAdminData] = useState<any>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)

  useEffect(() => {
    // Check authentication
    const isAuthed = localStorage.getItem("isSubAdminAuthed")
    const savedData = localStorage.getItem("subAdminData")

    if (!isAuthed || !savedData) {
      window.location.href = "/subadmin/login"
      return
    }

    setSubAdminData(JSON.parse(savedData))
    fetchOrders(JSON.parse(savedData).couponCode)
  }, [])

  const fetchOrders = async (couponCode: string) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data.success) {
        // Filter orders by this sub-admin's coupon code
        const filteredOrders = data.orders.filter(
          (order: Order) => order.couponCode === couponCode
        )
        setOrders(filteredOrders)
      } else {
        setError("Failed to load orders")
      }
    } catch (e) {
      setError("Failed to load orders")
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("isSubAdminAuthed")
    localStorage.removeItem("subAdminData")
    window.location.href = "/subadmin/login"
  }

  const viewScreenshot = (screenshotUrl: string) => {
    setSelectedScreenshot(screenshotUrl)
    setShowScreenshotModal(true)
  }

  if (!subAdminData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sub-Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {subAdminData.name} - Coupon: <span className="font-mono font-bold text-blue-600">{subAdminData.couponCode}</span>
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Orders ({orders.length})</CardTitle>
            <p className="text-sm text-gray-600">Orders placed with your coupon code: {subAdminData.couponCode}</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders found for your coupon code</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Order ID</th>
                      <th className="p-2 text-left">Customer</th>
                      <th className="p-2 text-left">Phone</th>
                      <th className="p-2 text-left">Address</th>
                      <th className="p-2 text-left">Items</th>
                      <th className="p-2 text-left">Total</th>
                      <th className="p-2 text-left">Payment</th>
                      <th className="p-2 text-left">Location</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{order._id.slice(-8)}</td>
                        <td className="p-2">
                          {order.user?.name || "-"}
                          <br />
                          <span className="text-xs text-gray-500">{order.user?.email}</span>
                        </td>
                        <td className="p-2">{order.user?.phone || "-"}</td>
                        <td className="p-2 text-xs">
                          {order.shippingAddress ? (
                            <div className="text-gray-700 leading-5">
                              <div>{order.shippingAddress.street}</div>
                              <div>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-xs">
                              {item.name} × {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="p-2 font-medium">₹{order.total.toLocaleString()}</td>
                        <td className="p-2">
                          {order.paymentScreenshot ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500 text-white text-xs">Screenshot</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewScreenshot(order.paymentScreenshot!)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : order.paymentVerified ? (
                            <Badge className="bg-green-500 text-white text-xs">Verified</Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white text-xs">Pending</Badge>
                          )}
                        </td>
                        <td className="p-2 text-xs">
                          {order.orderLocation ? (
                            <div className="text-gray-700">
                              <div>
                                {order.orderLocation.latitude.toFixed(5)}, {order.orderLocation.longitude.toFixed(5)}
                              </div>
                              <a
                                href={`https://www.google.com/maps?q=${order.orderLocation.latitude},${order.orderLocation.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Map
                              </a>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-2">
                          <Badge className="bg-purple-500 text-white text-xs">{order.status}</Badge>
                        </td>
                        <td className="p-2 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> You can only view orders placed with your assigned coupon code ({subAdminData.couponCode}).
            You do not have access to manage products, users, or other administrative functions.
          </AlertDescription>
        </Alert>
      </div>

      {/* Screenshot Modal */}
      <Dialog open={showScreenshotModal} onOpenChange={setShowScreenshotModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          {selectedScreenshot && (
            <div className="text-center">
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
                className="max-w-full max-h-96 object-contain rounded-lg border"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
