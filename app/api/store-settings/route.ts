import { type NextRequest, NextResponse } from "next/server"
import { StoreService } from "@/lib/services/storeService"

export async function GET() {
  try {
    const storeService = new StoreService()

    // Seed store settings if none exist
    await storeService.seedStoreSettings()

    const settings = await storeService.getStoreSettings()

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("Error fetching store settings:", error)
    return NextResponse.json({ error: "Failed to fetch store settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const storeService = new StoreService()

    const settings = await storeService.updateStoreSettings(body)

    return NextResponse.json({
      success: true,
      message: "Store settings updated successfully",
      settings,
    })
  } catch (error) {
    console.error("Error updating store settings:", error)
    return NextResponse.json({ error: "Failed to update store settings" }, { status: 500 })
  }
}
