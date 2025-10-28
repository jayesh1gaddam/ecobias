"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Clock } from "lucide-react"
import { UPI_QR_CODE_DATA } from "@/lib/upi-payment"

interface UPIPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  description: string
  orderId: string
  onPaymentComplete: () => void
}

const WHATSAPP_QR = "/images/new_wa_qr.jpg" // Updated WhatsApp QR image
const WHATSAPP_NUMBER = "YOUR_NUMBER_HERE" // Optionally, use wa.me link

export default function UPIPaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  orderId,
  onPaymentComplete,
}: UPIPaymentModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(300) // 5 minutes

  useEffect(() => {
    if (!isOpen) return
    setSecondsLeft(300)
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Payment Instructions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pb-4">
          {/* UPI QR Section */}
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="font-semibold mb-2 text-purple-700 text-sm">Step 1: Pay via UPI QR</div>
            <img
              src={UPI_QR_CODE_DATA.qrCodeUrl}
              alt="UPI QR Code"
              className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg border mb-2"
            />
            <div className="font-medium mb-1 text-sm">Amount: <span className="text-base sm:text-lg font-bold">₹{amount.toLocaleString()}</span></div>
            <div className="text-xs sm:text-sm text-gray-600 mb-1">{description}</div>
          </div>

          {/* WhatsApp QR Section */}
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="font-semibold mb-2 text-green-700 text-sm">Step 2: Send Payment Screenshot on WhatsApp</div>
            <img
              src={WHATSAPP_QR}
              alt="WhatsApp QR Code"
              className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg border"
            />
          </div>

          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Reverse Countdown:</span>
                <span className="font-mono text-lg">{minutes}:{seconds.toString().padStart(2, "0")}</span>
              </div>
              <div className="mt-2 text-sm">
                Please send your payment screenshot to our WhatsApp within <b>5 minutes</b> to confirm your order.<br />
                Orders not confirmed in time may be cancelled.
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
} 