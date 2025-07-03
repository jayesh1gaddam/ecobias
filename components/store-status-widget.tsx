"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Store } from "lucide-react"
import { isStoreOpen } from "@/lib/store-hours"

export default function StoreStatusWidget() {
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean
    message: string
    nextOpenTime?: string
  }>({ isOpen: true, message: "Checking..." })

  useEffect(() => {
    const checkStatus = () => {
      const status = isStoreOpen()
      setStoreStatus(status)
    }

    checkStatus()

    // Update every minute
    const interval = setInterval(checkStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className={`${storeStatus.isOpen ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Store className={`h-5 w-5 ${storeStatus.isOpen ? "text-green-600" : "text-red-600"}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Store Status</span>
              <Badge variant={storeStatus.isOpen ? "default" : "destructive"}>
                {storeStatus.isOpen ? "OPEN" : "CLOSED"}
              </Badge>
            </div>
            <p className={`text-sm ${storeStatus.isOpen ? "text-green-700" : "text-red-700"}`}>{storeStatus.message}</p>
          </div>
          <Clock className={`h-4 w-4 ${storeStatus.isOpen ? "text-green-600" : "text-red-600"}`} />
        </div>
      </CardContent>
    </Card>
  )
}
