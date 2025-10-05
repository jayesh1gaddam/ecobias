"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Truck, PackageCheck, X, Eye, CheckCircle, XCircle } from "lucide-react"

interface Order {
  _id: string
  user: { name: string; email: string; phone: string }
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: string
  createdAt: string
  paymentScreenshot?: string
  paymentVerified: boolean
  paymentVerifiedBy?: string
  paymentVerifiedAt?: string
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

const STATUS = ["pending", "shipped", "delivered"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)
  const [verifyingOrder, setVerifyingOrder] = useState<string | null>(null)

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

  const verifyPayment = async (orderId: string, action: "verify" | "reject") => {
    setVerifyingOrder(orderId)
    try {
      const res = await fetch("/api/orders/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          adminId: "admin", // In a real app, get from auth context
          action,
        }),
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
    } finally {
      setVerifyingOrder(null)
    }
  }

  const viewScreenshot = (screenshotUrl: string) => {
    setSelectedScreenshot(screenshotUrl)
    setShowScreenshotModal(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {(() => {
        const readyToDeliver = orders.filter((o) => o.paymentVerified)
        const unapproved = orders.filter((o) => !o.paymentVerified)

        const renderTable = (rows: Order[]) => (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">User</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Payment</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o._id} className="border-b">
                    <td className="p-2">{o.user?.name || "-"}<br /><span className="text-xs text-gray-500">{o.user?.email}</span></td>
                    <td className="p-2">{o.user?.phone || "-"}</td>
                    <td className="p-2 align-top">
                      {o.shippingAddress ? (
                        <div className="text-xs text-gray-700 leading-5">
                          <div>{o.shippingAddress.street}</div>
                          <div>{o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zipCode}</div>
                          <div>{o.shippingAddress.country}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      {o.items.map((item, i) => (
                        <div key={i}>{item.name} × {item.quantity}</div>
                      ))}
                    </td>
                    <td className="p-2">₹{o.total}</td>
                    <td className="p-2">
                      {o.paymentScreenshot ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500 text-white">Screenshot Uploaded</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewScreenshot(o.paymentScreenshot!)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : o.paymentVerified ? (
                        <Badge className="bg-green-500 text-white">Verified</Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white">Pending</Badge>
                      )}
                    </td>
                    <td className="p-2">
                        {o.orderLocation ? (
                          <div className="text-xs text-gray-700">
                            <div>{o.orderLocation.latitude.toFixed(5)}, {o.orderLocation.longitude.toFixed(5)}</div>
                            {o.orderLocation.accuracy !== undefined && <div>±{Math.round(o.orderLocation.accuracy)} m</div>}
                            {o.orderLocation.capturedAt && <div>{new Date(o.orderLocation.capturedAt).toLocaleString()}</div>}
                            <a
                              href={`https://www.google.com/maps?q=${o.orderLocation.latitude},${o.orderLocation.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >Open in Maps</a>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    <td className="p-2">
                      <Badge className="bg-[var(--color-accent)] text-white">{o.status}</Badge>
                    </td>
                    <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="p-2 space-x-2">
                      {/* Payment Verification */}
                      {(!o.paymentVerified) && (
                        <div className="flex gap-1 mb-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => verifyPayment(o._id, "verify")}
                            disabled={verifyingOrder === o._id}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => verifyPayment(o._id, "reject")}
                            disabled={verifyingOrder === o._id}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {/* Order Status */}
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
        )

        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Ready to Deliver ({readyToDeliver.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div>Loading...</div> : readyToDeliver.length ? renderTable(readyToDeliver) : <div className="text-sm text-gray-500">No approved orders yet.</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Orders ({unapproved.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div>Loading...</div> : unapproved.length ? renderTable(unapproved) : <div className="text-sm text-gray-500">No unapproved orders.</div>}
              </CardContent>
            </Card>
          </>
        )
      })()}

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