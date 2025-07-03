import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

export async function GET() {
  try {
    const productService = new ProductService()

    // Seed products if none exist
    await productService.seedProducts()

    const products = await productService.getAllProducts()

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productService = new ProductService()

    const product = await productService.createProduct(body)

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
