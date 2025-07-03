"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Clock, AlertCircle, CheckCircle, Store, MapPin } from "lucide-react"
import { isStoreOpen } from "@/lib/store-hours"
import UserProfileForm from "@/components/user-profile-form"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function CheckoutPage() {
  const { toast } = useToast()
  const [cartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Chanel No. 5 Eau de Parfum",
      price: 150.0,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Dior Sauvage Eau de Toilette",
      price: 120.0,
      quantity: 2,
      image: "/placeholder.svg?height=80&width=80",
    },
  ])

  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean
    message: string
    nextOpenTime?: string
  }>({ isOpen: true, message: "Checking store hours..." })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)

  useEffect(() => {
    // Check store hours
    const status = isStoreOpen()
    setStoreStatus(status)

    // Load user profile
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15.0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  const processOrder = async () => {
    if (!storeStatus.isOpen) {
      toast({
        title: "Store Closed",
        description: "Orders can only be placed when the store is open.",
        variant: "destructive",
      })
      return
    }

    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before placing an order.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingOrder(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and redirect to success page
      toast({
        title: "Order Placed Successfully!",
        description: `Your order will be delivered to ${userProfile.address.city}, ${userProfile.address.state}.`,
      })

      // In real app, redirect to order confirmation page
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Profile Form */}
        <div className="space-y-6">
          <UserProfileForm onProfileSave={handleProfileSave} initialProfile={userProfile} />
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Store Status */}
          <Card className={storeStatus.isOpen ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${storeStatus.isOpen ? "text-green-800" : "text-red-800"}`}
              >
                <Store className="h-5 w-5" />
                Store Status
                <Badge variant={storeStatus.isOpen ? "default" : "destructive"}>
                  {storeStatus.isOpen ? "OPEN" : "CLOSED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-start gap-2 ${storeStatus.isOpen ? "text-green-700" : "text-red-700"}`}>
                {storeStatus.isOpen ? (
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <p>{storeStatus.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your items before placing the order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Address Display */}
              {userProfile && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Delivery Address:</p>
                      <p>{userProfile.address.street}</p>
                      <p>
                        {userProfile.address.city}, {userProfile.address.state} {userProfile.address.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Restrictions */}
              {!storeStatus.isOpen && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Orders cannot be placed while the store is closed.
                    {storeStatus.nextOpenTime && ` We'll be open ${storeStatus.nextOpenTime}.`}
                  </AlertDescription>
                </Alert>
              )}

              {/* Place Order Button */}
              <Button
                onClick={processOrder}
                className="w-full"
                size="lg"
                disabled={!storeStatus.isOpen || !userProfile || isProcessingOrder}
              >
                {isProcessingOrder
                  ? "Processing Order..."
                  : !storeStatus.isOpen
                    ? "Store Closed - Cannot Order"
                    : !userProfile
                      ? "Complete Profile to Order"
                      : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
