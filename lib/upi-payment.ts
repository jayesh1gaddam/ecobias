"use client"

export interface UPIPaymentData {
  orderId: string
  amount: number
  description: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
}

export interface PaymentScreenshotData {
  orderId: string
  screenshotUrl: string
}

export async function createUPIOrder(
  amount: number,
  description: string,
  userDetails: { name: string; email: string; phone: string },
  userId: string,
  orderType: "membership" | "product",
  orderDetails: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
) {
  try {
    // Always send all required fields including coupon code
    const payload = {
      userId,
      items: orderType === "product" ? orderDetails.items : [],
      subtotal: orderType === "product" ? orderDetails.subtotal : amount,
      shipping: orderType === "product" ? orderDetails.shipping : 0,
      tax: orderType === "product" ? orderDetails.tax : 0,
      total: amount,
      couponCode: orderDetails.coupon_code || "", // Include coupon code (mandatory for products)
      shippingAddress: orderType === "product" ? orderDetails.shipping_address : {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      orderLocation: orderType === "product" ? orderDetails.order_location : undefined,
    }
    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!orderResponse.ok) {
      throw new Error("Failed to create order")
    }

    const orderData = await orderResponse.json()
    
    // Return order data for QR code display
    onSuccess({
      orderId: orderData.order._id,
      amount,
      description,
      userDetails,
      orderType,
      orderDetails,
    })
  } catch (error) {
    console.error("Error creating UPI order:", error)
    onError(error)
  }
}

export async function uploadPaymentScreenshot(
  orderId: string,
  screenshotUrl: string,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
) {
  try {
    const response = await fetch("/api/orders/upload-screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        screenshotUrl,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to upload payment screenshot")
    }

    const result = await response.json()
    onSuccess(result)
  } catch (error) {
    console.error("Error uploading payment screenshot:", error)
    onError(error)
  }
}

// UPI QR Code data (you should replace this with your actual UPI QR code)
export const UPI_QR_CODE_DATA = {
  upiId: "jayeshgaddam123@okicici", // Updated to your actual UPI ID
  name: "Jayesh Gaddam",
  qrCodeUrl: "/images/new_payment_qr.jpg", // Updated to new payment QR image
}

export function generateUPIQRCode(amount: number, description: string): string {
  // Generate UPI payment URL
  const upiUrl = `upi://pay?pa=${UPI_QR_CODE_DATA.upiId}&pn=${encodeURIComponent(UPI_QR_CODE_DATA.name)}&am=${amount}&tn=${encodeURIComponent(description)}`
  return upiUrl
} 