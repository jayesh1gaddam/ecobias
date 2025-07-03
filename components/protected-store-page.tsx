"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingCart,
  Search,
  Filter,
  Star,
  Heart,
  Plus,
  Minus,
  Store,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Crown,
  LogOut,
  User,
} from "lucide-react"
import { isStoreOpen } from "@/lib/store-hours"
import StoreStatusWidget from "@/components/store-status-widget"
import { getCurrentUser, logout, isPremiumMember } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  description: string
  inStock: boolean
  stockQuantity: number
  isNew?: boolean
  isBestseller?: boolean
  isPremium?: boolean
}

interface CartItem extends Product {
  quantity: number
}

const CATEGORIES = ["All", "Women", "Men", "Unisex"]
const BRANDS = ["All", "Chanel", "Dior", "Tom Ford", "Creed", "Marc Jacobs", "MFK"]
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
]

export default function ProtectedStorePage() {
  const { toast } = useToast()
  const [user, setUser] = useState(getCurrentUser())
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean
    message: string
    nextOpenTime?: string
  }>({ isOpen: true, message: "Checking..." })
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [userIsPremium, setUserIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (!user) {
      window.location.href = "/login"
      return
    }

    // Check premium status
    setUserIsPremium(isPremiumMember())

    // Check store status
    const status = isStoreOpen()
    setStoreStatus(status)

    // Load data
    loadProducts()
    loadStoreSettings()

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    setIsLoading(false)
  }, [user])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  const loadStoreSettings = async () => {
    try {
      const response = await fetch("/api/store-settings")
      const data = await response.json()

      if (data.success) {
        setStoreInfo(data.settings)
      }
    } catch (error) {
      console.error("Error loading store settings:", error)
    }
  }

  useEffect(() => {
    // Filter and sort products
    let filtered = products

    // Filter premium products based on user membership
    if (!userIsPremium) {
      filtered = filtered.filter((product) => !product.isPremium)
    }

    // Show only premium products if toggle is on
    if (showPremiumOnly && userIsPremium) {
      filtered = filtered.filter((product) => product.isPremium)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Apply brand filter
    if (selectedBrand !== "All") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Featured - bestsellers first, then by rating
        filtered.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1
          if (!a.isBestseller && b.isBestseller) return 1
          return b.rating - a.rating
        })
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, showPremiumOnly, userIsPremium])

  const addToCart = (product: Product) => {
    if (!storeStatus.isOpen) {
      toast({
        title: "Store Closed",
        description: "Items cannot be added to cart while the store is closed.",
        variant: "destructive",
      })
      return
    }

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    if (product.isPremium && !userIsPremium) {
      toast({
        title: "Premium Required",
        description: "This is a premium product. Upgrade to premium membership to purchase.",
        variant: "destructive",
      })
      return
    }

    const existingItem = cart.find((item) => item._id === product._id)
    let newCart: CartItem[]

    if (existingItem) {
      newCart = cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]
    }

    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const updateCartQuantity = (productId: string, change: number) => {
    const newCart = cart
      .map((item) => {
        if (item._id === productId) {
          const newQuantity = Math.max(0, item.quantity + change)
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
        }
        return item
      })
      .filter(Boolean) as CartItem[]

    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find((item) => item._id === productId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--color-primary)] shadow-lg rounded-2xl mt-3 mx-auto z-50 fixed left-1/2 -translate-x-1/2 top-3 w-[99vw] md:w-[96vw] max-w-none flex-none px-1 sm:px-4">
        <div className="w-full flex flex-row items-center justify-between gap-2 sm:gap-0 px-2 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4 w-auto justify-start">
            <img src="/images/logo_eb.png" alt="Ecobias Logo" className="h-16 w-auto mr-1" />
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-secondary)]">Ecobias</h1>
              <p className="text-xs sm:text-sm text-[var(--color-secondary)] opacity-70 hidden sm:block">Premium Fragrances Collection</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-auto justify-end">
            {/* User Info */}
            <div className="flex items-center gap-1 sm:gap-2">
              <User className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-xs sm:text-sm text-[var(--color-secondary)]">{user.name}</span>
              {userIsPremium && (
                <Badge className="bg-[var(--color-accent)] text-[var(--color-secondary)]">
                  <Crown className="h-3 w-3 mr-1 text-[var(--color-secondary)]" />
                  Premium
                </Badge>
              )}
            </div>
            {/* Cart */}
            <Button
              variant="outline"
              className="relative px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base flex items-center justify-center border-[var(--color-secondary)] text-[var(--color-secondary)]"
              onClick={() => (window.location.href = "/checkout")}
            >
              <ShoppingCart className="h-5 w-5 sm:mr-2 text-[var(--color-secondary)]" />
              <span className="hidden sm:inline">Cart ({getTotalItems()})</span>
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[var(--color-accent)] text-[var(--color-secondary)]">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
            {/* Logout */}
            <Button
              variant="outline"
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base flex items-center justify-center border-[var(--color-secondary)] text-[var(--color-secondary)]"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 sm:mr-2 text-[var(--color-secondary)]" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="h-28 sm:h-32" />

      {/* Hero Section */}
      <section className="relative min-h-[28rem] sm:h-[32rem] flex items-center justify-center overflow-hidden bg-[var(--color-primary)]">
        <div className="absolute inset-0 bg-[var(--color-primary)]/70" />
        {/* Animated sparkles/particles */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className={`absolute animate-float-sparkle bg-[var(--color-accent)] rounded-full opacity-70 shadow-lg`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${12 + Math.random() * 16}px`,
                height: `${12 + Math.random() * 16}px`,
                animationDelay: `${Math.random() * 4}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
        <div className="relative z-20 flex flex-col items-start text-left w-full max-w-7xl mx-auto px-1 sm:px-2">
          <div className="backdrop-blur-xl bg-[var(--color-primary)]/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-0 w-full animate-fade-in-up overflow-hidden">
            <div className="flex flex-col md:flex-row w-full">
              {/* Left: Text and CTA */}
              <div className="flex-1 p-4 sm:p-8 md:p-16 flex flex-col justify-center">
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent)] to-[var(--color-accent)] bg-clip-text text-transparent drop-shadow-lg">
                  Discover Your Signature Scent
                </h1>
                <p className="text-base sm:text-lg md:text-2xl text-[var(--color-secondary)] mb-6 sm:mb-8 font-medium">
                  Elevate your presence with Ecobias. Explore a curated collection of luxury fragrances from the world's most prestigious brands.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
                  <Button size="lg" className="bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-lg hover:bg-[#181818] transition w-full sm:w-auto">
                    Shop Now
                  </Button>
                  {!userIsPremium && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition w-full sm:w-auto"
                      onClick={() => (window.location.href = "/membership")}
                    >
                      <Crown className="h-5 w-5 mr-2 text-[var(--color-accent)]" />
                      Go Premium
                    </Button>
                  )}
                </div>
              </div>
              {/* Right: Image */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
                <img
                  src="/images/mascot.png"
                  alt="Mascot Character"
                  className="w-full max-w-[140px] sm:max-w-[200px] md:max-w-[260px] rounded-xl sm:rounded-2xl shadow-xl object-contain scale-x-[-1]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the finest fragrances from iconic luxury brands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src="/images/chanel-no5.jpg"
                  alt="Chanel Collection"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Chanel</h3>
                  <p className="text-sm opacity-90">Timeless Elegance</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src="/images/guerlain-aqua.jpg"
                  alt="Guerlain Collection"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Guerlain</h3>
                  <p className="text-sm opacity-90">French Artistry</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src="/images/dolce-gabbana.jpg"
                  alt="Designer Collection"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Designer</h3>
                  <p className="text-sm opacity-90">Modern Luxury</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store Status */}
            <StoreStatusWidget />

            {/* Premium Membership Card */}
            {!userIsPremium && (
              <Card className="bg-[var(--color-primary)] border-0 shadow-xl animate-pulse-slow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[var(--color-accent)] font-extrabold text-xl md:text-2xl">
                    <Crown className="h-5 w-5 text-[var(--color-accent)] animate-bounce" />
                    Upgrade to Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-semibold text-[var(--color-accent)] mb-3">
                    Access exclusive premium fragrances and luxury benefits for just ₹299/year!
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/membership")}
                    className="w-full bg-[var(--color-accent)] text-[var(--color-primary)] font-bold shadow-lg hover:scale-105 transition-transform"
                  >
                    <Crown className="h-4 w-4 mr-2 text-[var(--color-primary)] animate-bounce" />
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Premium Toggle */}
            {userIsPremium && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Premium Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={showPremiumOnly ? "default" : "outline"}
                    onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                    className="w-full"
                  >
                    {showPremiumOnly ? "Show All Products" : "Show Premium Only"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Store Information */}
            {storeInfo && (
              <div className="hidden sm:block">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Store Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-gray-500" />
                      <p className="text-sm">{storeInfo.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{storeInfo.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{storeInfo.email}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="hidden sm:block">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brand</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800">Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {cart.slice(0, 3).map((item) => (
                      <div key={item._id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateCartQuantity(item._id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateCartQuantity(item._id, 1)}
                            disabled={!storeStatus.isOpen}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {cart.length > 3 && <p className="text-xs text-gray-500">+{cart.length - 3} more items</p>}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total: ₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!storeStatus.isOpen}
                    onClick={() => (window.location.href = "/checkout")}
                  >
                    {storeStatus.isOpen ? "Checkout" : "Store Closed"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search perfumes, brands, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Store Closed Alert */}
            {!storeStatus.isOpen && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Store is currently closed.</strong> You can browse products but cannot add items to cart or
                  place orders.
                  {storeStatus.nextOpenTime && ` We'll be open ${storeStatus.nextOpenTime}.`}
                </AlertDescription>
              </Alert>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const cartQuantity = getCartItemQuantity(product._id)

                return (
                  <Card key={product._id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isPremium && (
                          <Badge className="bg-[var(--color-accent)] text-[var(--color-primary)]">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {product.isNew && <Badge className="bg-[var(--color-accent)] text-[var(--color-primary)]">New</Badge>}
                        {product.isBestseller && <Badge className="bg-[var(--color-accent)] text-[var(--color-primary)]">Bestseller</Badge>}
                        {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                      </div>

                      {/* Wishlist Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock indicator */}
                        <div className="text-xs text-gray-500">
                          {product.inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
                        </div>

                        {/* Add to Cart / Quantity Controls */}
                        {cartQuantity === 0 ? (
                          <Button
                            onClick={() => addToCart(product)}
                            className="w-full"
                            disabled={!storeStatus.isOpen || !product.inStock || (product.isPremium && !userIsPremium)}
                          >
                            {!storeStatus.isOpen
                              ? "Store Closed"
                              : !product.inStock
                                ? "Out of Stock"
                                : product.isPremium && !userIsPremium
                                  ? "Premium Required"
                                  : "Add to Cart"}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(product._id, -1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center font-medium">{cartQuantity} in cart</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(product._id, 1)}
                              disabled={!storeStatus.isOpen}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
