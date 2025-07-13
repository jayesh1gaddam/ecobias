"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, QrCode, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { UPI_QR_CODE_DATA, generateUPIQRCode } from "@/lib/upi-payment"
import { useToast } from "@/hooks/use-toast"

interface UPIPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  description: string
  orderId: string
  onPaymentComplete: () => void
}

export default function UPIPaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  orderId,
  onPaymentComplete,
}: UPIPaymentModalProps) {
  const { toast } = useToast()
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const upiUrl = generateUPIQRCode(amount, description)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }
    setScreenshotFile(file)
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleUploadScreenshot = async () => {
    if (!screenshotFile) {
      toast({
        title: "No file selected",
        description: "Please select a payment screenshot to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      // Use FormData to send the file as multipart/form-data
      const formData = new FormData()
      formData.append("orderId", orderId)
      formData.append("screenshot", screenshotFile)

      const response = await fetch("/api/orders/upload-screenshot", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload screenshot")
      }

      setUploadStatus("success")
      toast({
        title: "Screenshot uploaded successfully!",
        description: "Your payment will be verified by our admin team shortly.",
      })

      // Close modal after a delay
      setTimeout(() => {
        onPaymentComplete()
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error uploading screenshot:", error)
      setUploadStatus("error")
      toast({
        title: "Upload failed",
        description: "There was an error uploading your screenshot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCopyUPIId = () => {
    navigator.clipboard.writeText(UPI_QR_CODE_DATA.upiId)
    toast({
      title: "UPI ID copied!",
      description: "You can now paste it in your UPI app",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            UPI Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Amount:</span>
              <span className="text-lg font-bold">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Description:</span>
              <span className="text-sm text-gray-600">{description}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
              <img
                src={UPI_QR_CODE_DATA.qrCodeUrl}
                alt="UPI QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            
            {/* UPI ID */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">UPI ID:</Label>
              <div className="flex items-center gap-2 justify-center">
                <Badge variant="outline" className="font-mono text-sm">
                  {UPI_QR_CODE_DATA.upiId}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyUPIId}
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Scan the QR code with your UPI app</li>
                <li>Or manually enter the UPI ID</li>
                <li>Complete the payment</li>
                <li>Take a screenshot of the successful payment</li>
                <li>Upload the screenshot below</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Screenshot Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Upload Payment Screenshot:</Label>
            
            {!screenshotPreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to select or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB
                </p>
                {isDragActive && (
                  <div className="text-blue-600 font-medium mt-2">Drop your file here</div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={screenshotPreview}
                    alt="Payment Screenshot"
                    className="w-full max-h-48 object-contain rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setScreenshotFile(null)
                      setScreenshotPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
                
                <Button
                  onClick={handleUploadScreenshot}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Screenshot
                    </>
                  )}
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Status */}
          {uploadStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Screenshot uploaded successfully! Your payment will be verified shortly.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to upload screenshot. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 