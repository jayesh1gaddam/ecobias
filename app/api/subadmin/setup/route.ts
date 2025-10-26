import { type NextRequest, NextResponse } from "next/server"
import { SubAdminService } from "@/lib/services/subAdminService"

// Define the 5 sub-admin accounts with their coupon codes
const subAdminsToCreate = [
  {
    username: "agent_red",
    password: "RedAgent@2025#Secure",
    name: "Agent_Red",
    email: "agent.red@perfumes.com",
    phone: "+91-9876543210",
    couponCode: "XK7M9PLQW2",
  },
  {
    username: "agent_blue",
    password: "BlueAgent@2025#Secure",
    name: "Agent_Blue",
    email: "agent.blue@perfumes.com",
    phone: "+91-9876543211",
    couponCode: "ZN4R8VTGH5",
  },
  {
    username: "agent_green",
    password: "GreenAgent@2025#Secure",
    name: "Agent_Green",
    email: "agent.green@perfumes.com",
    phone: "+91-9876543212",
    couponCode: "BJ6S3YFDK9",
  },
  {
    username: "agent_black",
    password: "BlackAgent@2025#Secure",
    name: "Agent_Black",
    email: "agent.black@perfumes.com",
    phone: "+91-9876543213",
    couponCode: "QW8L2NCXM7",
  },
  {
    username: "agent_gold",
    password: "GoldAgent@2025#Secure",
    name: "Agent_Gold",
    email: "agent.gold@perfumes.com",
    phone: "+91-9876543214",
    couponCode: "FP5T9HVRJ4",
  },
]

export async function POST(request: NextRequest) {
  try {
    const subAdminService = new SubAdminService()
    const results = []

    for (const subAdminData of subAdminsToCreate) {
      try {
        const createdSubAdmin = await subAdminService.createSubAdmin(subAdminData)

        results.push({
          success: true,
          username: subAdminData.username,
          password: subAdminData.password, // Include password in response (only for this setup)
          name: subAdminData.name,
          email: subAdminData.email,
          phone: subAdminData.phone,
          couponCode: subAdminData.couponCode,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subadmin/login`,
        })
      } catch (error) {
        results.push({
          success: false,
          username: subAdminData.username,
          name: subAdminData.name,
          couponCode: subAdminData.couponCode,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    const successful = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    return NextResponse.json({
      success: failed.length === 0,
      message: `Created ${successful.length} out of ${results.length} sub-admins`,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
      },
      subAdmins: successful,
      errors: failed.length > 0 ? failed : undefined,
      instructions: {
        note: "Save these credentials securely. Passwords are hashed in the database.",
        usage: [
          "1. Share credentials with respective sub-admins",
          "2. Sub-admins can only view orders with their assigned coupon code",
          "3. Customers MUST use these coupon codes during checkout",
          "4. Sub-admins have NO access to other admin functions",
        ],
        couponCodes: successful.map((sa) => sa.couponCode),
      },
    })
  } catch (error) {
    console.error("Error setting up sub-admins:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to set up sub-admins",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
