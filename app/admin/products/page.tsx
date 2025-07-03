"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"

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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  // Form state
  const [form, setForm] = useState<Partial<Product>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      if (data.success) setProducts(data.products)
      else setError("Failed to load products")
    } catch (e) {
      setError("Failed to load products")
    }
    setLoading(false)
  }

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowAdd(false)
        setForm({})
        fetchProducts()
      }
    } catch {}
  }

  const handleEdit = async () => {
    if (!editProduct) return
    try {
      const res = await fetch(`/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setEditProduct(null)
        setForm({})
        fetchProducts()
      }
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) fetchProducts()
    } catch {}
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { setShowAdd(true); setForm({}) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Brand</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Premium</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.brand}</td>
                      <td className="p-2">₹{p.price}</td>
                      <td className="p-2">{p.inStock ? `${p.stockQuantity} in stock` : <span className="text-red-500">Out</span>}</td>
                      <td className="p-2">{p.isPremium && <Badge className="bg-[var(--color-accent)] text-white">Premium</Badge>}</td>
                      <td className="p-2 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditProduct(p); setForm(p) }}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Add/Edit Modal */}
      {(showAdd || editProduct) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{showAdd ? "Add Product" : "Edit Product"}</h2>
            <div className="space-y-3">
              <Input name="name" placeholder="Name" value={form.name || ""} onChange={handleInput} />
              <Input name="brand" placeholder="Brand" value={form.brand || ""} onChange={handleInput} />
              <Input name="price" placeholder="Price" type="number" value={form.price || ""} onChange={handleInput} />
              <Input name="stockQuantity" placeholder="Stock Quantity" type="number" value={form.stockQuantity || ""} onChange={handleInput} />
              <Input name="image" placeholder="Image URL" value={form.image || ""} onChange={handleInput} />
              <Input name="category" placeholder="Category" value={form.category || ""} onChange={handleInput} />
              <Input name="description" placeholder="Description" value={form.description || ""} onChange={handleInput} />
              <div className="flex items-center gap-2">
                <label className="text-sm">Premium</label>
                <input type="checkbox" name="isPremium" checked={!!form.isPremium} onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">In Stock</label>
                <input type="checkbox" name="inStock" checked={!!form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setShowAdd(false); setEditProduct(null); setForm({}) }}><X className="h-4 w-4" /> Cancel</Button>
              <Button onClick={showAdd ? handleAdd : handleEdit}>
                <Check className="h-4 w-4" /> {showAdd ? "Add" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 