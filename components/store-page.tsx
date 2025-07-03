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
} from "lucide-react"
import { isStoreOpen, getStoreSettings } from "@/lib/store-hours"
import StoreStatusWidget from "@/components/store-status-widget"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
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
  isNew?: boolean
  isBestseller?: boolean
}

interface CartItem extends Product {
  quantity: number
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Chanel No. 5 Eau de Parfum",
    brand: "Chanel",
    price: 150.0,
    originalPrice: 180.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Women",
    rating: 4.8,
    reviewCount: 1247,
    description: "The world's most iconic fragrance. A timeless floral aldehyde.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Dior Sauvage Eau de Toilette",
    brand: "Dior",
    price: 120.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Men",
    rating: 4.7,
    reviewCount: 892,
    description: "A radically fresh composition, dictated by a name that has the ring of a manifesto.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "3",
    name: "Tom Ford Black Orchid",
    brand: "Tom Ford",
    price: 195.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Unisex",
    rating: 4.6,
    reviewCount: 634,
    description: "A luxurious and sensual fragrance of rich, dark accords and an alluring potion of black orchids.",
    inStock: true,
    isNew: true,
  },
  {
    id: "4",
    name: "Yves Saint Laurent Libre",
    brand: "YSL",
    price: 135.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Women",
    rating: 4.5,
    reviewCount: 456,
    description: "The freedom to live everything intensely. A burning and addictive trail.",
    inStock: false,
  },
  {
    id: "5",
    name: "Creed Aventus",
    brand: "Creed",
    price: 350.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Men",
    rating: 4.9,
    reviewCount: 1823,
    description: "A sophisticated scent perfect for the bold, spirited and confident modern man.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "6",
    name: "Marc Jacobs Daisy",
    brand: "Marc Jacobs",
    price: 89.0,
    originalPrice: 110.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Women",
    rating: 4.4,
    reviewCount: 723,
    description: "A charming, whimsical fragrance with a youthful, fresh spirit.",
    inStock: true,
    isNew: true,
  },
]

const CATEGORIES = ["All", "Women", "Men", "Unisex"]
const BRANDS = ["All", "Chanel", "Dior", "Tom Ford", "YSL", "Creed", "Marc Jacobs"]
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
]

export default function StorePage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean
    message: string
    nextOpenTime?: string
  }>({ isOpen: true, message: "Checking..." })
  const [storeInfo, setStoreInfo] = useState<any>(null)

  useEffect(() => {
    // Check store status
    const status = isStoreOpen()
    setStoreStatus(status)

    // Get store information
    const settings = getStoreSettings()
    setStoreInfo(settings)

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Filter and sort products
    let filtered = products

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
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy])

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

    const existingItem = cart.find((item) => item.id === product.id)
    let newCart: CartItem[]

    if (existingItem) {
      newCart = cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
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
        if (item.id === productId) {
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
    const item = cart.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ecobias</h1>
                <p className="text-sm text-gray-600">Premium Fragrances Collection</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({getTotalItems()})
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
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

            {/* Store Information */}
            {storeInfo && (
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
            )}

            {/* Filters */}
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

            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800">Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {cart.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateCartQuantity(item.id, 1)}
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
                      <span>Total: ${getTotalPrice().toFixed(2)}</span>
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
                const cartQuantity = getCartItemQuantity(product.id)

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
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
                          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart / Quantity Controls */}
                        {cartQuantity === 0 ? (
                          <Button
                            onClick={() => addToCart(product)}
                            className="w-full"
                            disabled={!storeStatus.isOpen || !product.inStock}
                          >
                            {!storeStatus.isOpen ? "Store Closed" : !product.inStock ? "Out of Stock" : "Add to Cart"}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(product.id, -1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center font-medium">{cartQuantity} in cart</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(product.id, 1)}
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
