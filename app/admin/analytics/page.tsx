"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import AnalyticsChart from "@/components/admin/analytics-chart"

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res)
        else setError("Failed to load analytics")
        setLoading(false)
      })
      .catch(() => { setError("Failed to load analytics"); setLoading(false) })
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--color-accent)]">₹{data.totalSales.toLocaleString()}</div>
                <Badge className="mt-2 bg-[var(--color-accent)] text-white">This Year</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.totalOrders}</div>
                <Badge className="mt-2 bg-[var(--color-accent)] text-white">All Time</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.totalProducts}</div>
                <Badge className="mt-2 bg-[var(--color-accent)] text-white">Current</Badge>
              </CardContent>
            </Card>
          </div>
          {/* Real sales chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsChart salesData={data.salesData} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 