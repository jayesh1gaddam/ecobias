"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Check, Star, Gift, Truck, Shield, Zap, Percent, Clock, Package } from "lucide-react"
import { getCurrentUser, setCurrentUser, isPremiumMember } from "@/lib/auth"
import { createUPIOrder } from "@/lib/upi-payment"
import { useToast } from "@/hooks/use-toast"
import UPIPaymentModal from "@/components/upi-payment-modal"

const MEMBERSHIP_PRICE = 299
const MEMBERSHIP_DURATION_DAYS = 30

const PREMIUM_BENEFITS = [
  {
    icon: Percent,
    title: "Big Discounts",
    description: "Save big on ALL products every day. Why wait for a sale?",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Our shipping charges are on us.",
  },
  {
    icon: Star,
    title: "Early Access",
    description: "Get your hands on select products and designs before others do.",
  },
  {
    icon: Clock,
    title: "Prioritised Shipping",
    description: "We ship your orders before everyone else's.",
  },
  {
    icon: Crown,
    title: "Exclusive Premium Products",
    description: "Access to limited edition and premium fragrances not available to regular users",
  },
  {
    icon: Shield,
    title: "Extended Return Policy",
    description: "Extended 30-day return policy instead of the standard 15-day policy",
  },
]

export default function MembershipPage() {
  const { toast } = useToast()
  const [user, setUser] = useState(getCurrentUser())
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    setIsPremium(isPremiumMember())
  }, [user])

  const handleUpgradeToPremium = async () => {
    if (!user) return

    setIsProcessing(true)

    try {
      await createUPIOrder(
        MEMBERSHIP_PRICE,
        "Premium Membership - Luxury Perfumes",
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        user._id?.toString() || "",
        "membership",
        {
          amount: MEMBERSHIP_PRICE,
          duration_months: 12,
        },
        (response: any) => {
          // Order created successfully, show payment modal
          console.log("Order created:", response)
          setCurrentOrderId(response.orderId)
          setShowPaymentModal(true)
          setIsProcessing(false)
        },
        (error: any) => {
          // Order creation failed
          console.error("Order creation failed:", error)
          toast({
            title: "Payment Error",
            description: "Unable to create membership order. Please try again.",
            variant: "destructive",
          })
          setIsProcessing(false)
        },
      )
    } catch (error) {
      console.error("Payment initiation failed:", error)
      toast({
        title: "Payment Error",
        description: "Unable to initiate payment. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handlePaymentComplete = () => {
    if (!user) return

    // Update user to premium
    const updatedUser = {
      ...user,
      isPremium: true,
      membershipExpiry: new Date(
        Date.now() + MEMBERSHIP_DURATION_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }

    // Update in localStorage
    setCurrentUser(updatedUser)
    setUser(updatedUser)
    setIsPremium(true)

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u._id === user._id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("users", JSON.stringify(users))
    }

    toast({
      title: "Membership Order Placed!",
      description: "Your membership order has been placed. We'll verify your payment and activate your premium status shortly.",
    })

    // Redirect to store after a delay
    setTimeout(() => {
      window.location.href = "/store"
    }, 2000)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Premium Membership</h1>
          </div>
          <p className="text-lg text-gray-600">Unlock exclusive access to premium fragrances and luxury benefits</p>
        </div>

        {/* Current Status */}
        {isPremium ? (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <Crown className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>You are already a Premium Member!</strong> Enjoy exclusive access to premium products and
              benefits.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Crown className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Upgrade to Premium</strong> to access exclusive premium products and luxury benefits.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Premium Benefits</CardTitle>
                <CardDescription>Everything you get with your premium membership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PREMIUM_BENEFITS.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <benefit.icon className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Premium Products Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Premium Products Preview
                </CardTitle>
                <CardDescription>Exclusive fragrances available only to premium members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Tom Ford Oud Wood Premium",
                      price: "₹25,999",
                      image: "/images/guerlain-sequin.jpg",
                    },
                    {
                      name: "Creed Royal Oud Limited Edition",
                      price: "₹35,999",
                      image: "/images/perfume-hero.jpg",
                    },
                    {
                      name: "Atkinsons The Big Bad Cedar",
                      price: "₹12,500",
                      image: "/images/atkinsons-cedar.jpg",
                    },
                    {
                      name: "Chanel Gabrielle Premium",
                      price: "₹9,200",
                      image: "/images/chanel-gabrielle.jpg",
                    },
                  ].map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50"
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-purple-600 font-semibold">{product.price}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          Premium Only
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <CardTitle className="text-xl">Premium Membership</CardTitle>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">₹{MEMBERSHIP_PRICE}</div>
                  <div className="text-sm text-gray-600">for {MEMBERSHIP_DURATION_DAYS} days</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Access to premium products</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Free express delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Early access to sales</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Extended return policy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Exclusive member events</span>
                  </div>
                </div>

                {isPremium ? (
                  <div className="text-center">
                    <Badge className="bg-green-500 text-white px-4 py-2">
                      <Crown className="h-4 w-4 mr-1" />
                      Active Premium Member
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Membership expires:{" "}
                      {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString() : "Never"}
                    </p>
                    <Button onClick={() => (window.location.href = "/store")} className="w-full mt-4">
                      Go to Store
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleUpgradeToPremium}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Upgrade to Premium - ₹${MEMBERSHIP_PRICE}`}
                  </Button>
                )}

                <div className="text-center">
                  <p className="text-xs text-gray-500">Secure payment via UPI QR Code</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      {currentOrderId && (
        <UPIPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={MEMBERSHIP_PRICE}
          description="Premium Membership - Luxury Perfumes"
          orderId={currentOrderId}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}
