"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Clock, AlertCircle, CheckCircle, Store, MapPin, Crown, User } from "lucide-react"
import { isStoreOpen } from "@/lib/store-hours"
import { getCurrentUser, isPremiumMember } from "@/lib/auth"
import { createUPIOrder } from "@/lib/upi-payment"
import { useToast } from "@/hooks/use-toast"
import UPIPaymentModal from "@/components/upi-payment-modal"

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  image: string
  isPremium?: boolean
}

export default function ProtectedCheckoutPage() {
  const { toast } = useToast()
  const [user, setUser] = useState(getCurrentUser())
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean
    message: string
    nextOpenTime?: string
  }>({ isOpen: true, message: "Checking store hours..." })
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [userIsPremium, setUserIsPremium] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    if (!user) {
      window.location.href = "/login"
      return
    }

    // Check premium status
    setUserIsPremium(isPremiumMember())

    // Check store hours
    const status = isStoreOpen()
    setStoreStatus(status)

    // Load cart
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [user])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = userIsPremium ? 0 : 500 // Free shipping for premium members
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + shipping + tax

  const processOrder = async () => {
    if (!storeStatus.isOpen) {
      toast({
        title: "Store Closed",
        description: "Orders can only be placed when the store is open.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    // Check if cart contains premium items and user is not premium
    const hasPremiumItems = cartItems.some((item) => item.isPremium)
    if (hasPremiumItems && !userIsPremium) {
      toast({
        title: "Premium Membership Required",
        description: "Your cart contains premium items. Please upgrade to premium membership.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingOrder(true)

    try {
      // Try to capture geolocation for precise order location
      const geoPosition: { latitude?: number; longitude?: number; accuracy?: number } = {}
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) return reject(new Error("Geolocation not supported"))
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 })
        })
        geoPosition.latitude = pos.coords.latitude
        geoPosition.longitude = pos.coords.longitude
        geoPosition.accuracy = pos.coords.accuracy
      } catch {}

      await createUPIOrder(
        total,
        `Order from Luxury Perfumes - ${cartItems.length} items`,
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        user._id?.toString() || "",
        "product",
        {
          items: cartItems,
          total_amount: total,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          shipping_address: user.address,
          order_location: geoPosition.latitude !== undefined && geoPosition.longitude !== undefined ? {
            latitude: geoPosition.latitude,
            longitude: geoPosition.longitude,
            accuracy: geoPosition.accuracy,
            capturedAt: new Date().toISOString(),
          } : undefined,
        },
        (response: any) => {
          // Order created successfully, show payment modal
          console.log("Order created:", response)
          setCurrentOrderId(response.orderId)
          setShowPaymentModal(true)
          setIsProcessingOrder(false)
        },
        (error: any) => {
          // Order creation failed
          console.error("Order creation failed:", error)
          toast({
            title: "Order Failed",
            description: "There was an error creating your order. Please try again.",
            variant: "destructive",
          })
          setIsProcessingOrder(false)
        },
      )
    } catch (error) {
      console.error("Order processing failed:", error)
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
      setIsProcessingOrder(false)
    }
  }

  const handlePaymentComplete = () => {
    // Clear cart
    localStorage.removeItem("cart")
    setCartItems([])

    toast({
      title: "Order Placed Successfully!",
      description: `Your order has been placed and payment screenshot uploaded. We'll verify and process it shortly.`,
    })

    // Redirect to store after a delay
    setTimeout(() => {
      window.location.href = "/store"
    }, 3000)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img src="/images/perfume-collection.jpg" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - User Info */}
            <div className="space-y-6">
              {/* User Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                    {userIsPremium && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium">Delivery Address:</p>
                        <p>{user.address.street}</p>
                        <p>
                          {user.address.city}, {user.address.state} {user.address.zipCode}
                        </p>
                        <p>{user.address.country}</p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Address Policy:</strong> To change your delivery address, you'll need to create a new
                      account. Each account can have only one address.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Premium Benefits */}
              {userIsPremium && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      Premium Benefits Applied
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-purple-700">
                    <ul className="space-y-1 text-sm">
                      <li>✓ Free express delivery (₹500 saved)</li>
                      <li>✓ Access to premium products</li>
                      <li>✓ Priority customer support</li>
                      <li>✓ Extended return policy</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
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
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Your cart is empty</p>
                      <Button onClick={() => (window.location.href = "/store")} className="mt-4">
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{item.name}</p>
                                {item.isPremium && (
                                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                                    <Crown className="h-2 w-2 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{item.brand}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Order Totals */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span className={userIsPremium ? "text-green-600" : ""}>
                            {userIsPremium ? "FREE" : `₹${shipping.toLocaleString()}`}
                            {userIsPremium && <span className="text-xs ml-1">(Premium)</span>}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (GST 18%)</span>
                          <span>₹{tax.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{total.toLocaleString()}</span>
                        </div>
                      </div>

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
                        disabled={!storeStatus.isOpen || cartItems.length === 0 || isProcessingOrder}
                      >
                        {isProcessingOrder
                          ? "Processing Order..."
                          : !storeStatus.isOpen
                            ? "Store Closed - Cannot Order"
                            : cartItems.length === 0
                              ? "Cart is Empty"
                              : `Place Order - ₹${total.toLocaleString()}`}
                      </Button>

                      <div className="text-center">
                        <p className="text-xs text-gray-500">Secure payment via UPI QR Code</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      {currentOrderId && (
        <UPIPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={total}
          description={`Order from Luxury Perfumes - ${cartItems.length} items`}
          orderId={currentOrderId}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}
