"use client"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function createRazorpayOrder(amount: number, description: string) {
  try {
    const response = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          description: description,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export async function verifyPayment(
  paymentData: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  },
  userId: string,
  orderType: "membership" | "product",
  orderDetails: any,
) {
  try {
    const response = await fetch("/api/razorpay/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...paymentData,
        user_id: userId,
        order_type: orderType,
        order_details: orderDetails,
      }),
    })

    if (!response.ok) {
      throw new Error("Payment verification failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying payment:", error)
    throw error
  }
}

export async function initiatePayment(
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
    const isLoaded = await loadRazorpay()
    if (!isLoaded) {
      throw new Error("Razorpay SDK failed to load")
    }

    const order = await createRazorpayOrder(amount, description)

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890",
      amount: order.amount,
      currency: order.currency,
      name: "Luxury Perfumes",
      description: description,
      order_id: order.id,
      handler: async (response: any) => {
        try {
          // Verify payment on server
          const verificationResult = await verifyPayment(
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            userId,
            orderType,
            orderDetails,
          )

          if (verificationResult.success) {
            onSuccess(response)
          } else {
            throw new Error("Payment verification failed")
          }
        } catch (error) {
          onError(error)
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: "#8B5CF6",
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.on("payment.failed", onError)
    razorpay.open()
  } catch (error) {
    onError(error)
  }
}
