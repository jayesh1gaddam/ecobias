/**
 * Database Script: Create 5 Sub-Admin Accounts with Unique Coupon Codes
 *
 * This script creates 5 sub-admin accounts, each with their own unique coupon code.
 * Sub-admins can only view orders placed with their assigned coupon code.
 *
 * Run this script with: npx ts-node scripts/create-subadmins.ts
 */

import { SubAdminService } from "../lib/services/subAdminService.js"

// Define the 5 sub-admin accounts with their coupon codes
const subAdmins = [
  {
    username: "agent_red",
    password: "RedAgent@2025#Secure", // Strong password
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

async function createSubAdmins() {
  console.log("🚀 Starting sub-admin creation process...\n")

  const subAdminService = new SubAdminService()
  const results = []

  for (const subAdminData of subAdmins) {
    try {
      console.log(`📝 Creating sub-admin: ${subAdminData.name} (${subAdminData.username})`)
      console.log(`   Coupon Code: ${subAdminData.couponCode}`)

      const createdSubAdmin = await subAdminService.createSubAdmin(subAdminData)

      console.log(`✅ Successfully created sub-admin: ${subAdminData.name}`)
      console.log(`   ID: ${createdSubAdmin._id}\n`)

      results.push({
        success: true,
        username: subAdminData.username,
        name: subAdminData.name,
        couponCode: subAdminData.couponCode,
      })
    } catch (error) {
      console.error(`❌ Failed to create sub-admin: ${subAdminData.name}`)
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}\n`)

      results.push({
        success: false,
        username: subAdminData.username,
        name: subAdminData.name,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(80))
  console.log("📊 SUB-ADMIN CREATION SUMMARY")
  console.log("=".repeat(80) + "\n")

  const successful = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  console.log(`✅ Successful: ${successful.length}/${results.length}`)
  console.log(`❌ Failed: ${failed.length}/${results.length}\n`)

  if (successful.length > 0) {
    console.log("📋 SUB-ADMIN CREDENTIALS (Save these securely!)")
    console.log("=".repeat(80))
    console.log("")

    successful.forEach((result, index) => {
      const subAdmin = subAdmins.find((sa) => sa.username === result.username)!
      console.log(`${index + 1}. Sub-Admin: ${result.name}`)
      console.log(`   Username: ${result.username}`)
      console.log(`   Password: ${subAdmin.password}`)
      console.log(`   Coupon Code: ${result.couponCode}`)
      console.log(`   Login URL: http://localhost:3000/subadmin/login`)
      console.log("")
    })

    console.log("=".repeat(80))
    console.log("\n⚠️  IMPORTANT NOTES:")
    console.log("   1. Save these credentials securely - passwords are hashed in the database")
    console.log("   2. Share the credentials with respective sub-admins")
    console.log("   3. Sub-admins can only view orders with their assigned coupon code")
    console.log("   4. Customers MUST use these coupon codes during checkout")
    console.log("   5. Sub-admins have NO access to other admin functions\n")
  }

  if (failed.length > 0) {
    console.log("❌ FAILED SUB-ADMINS:")
    console.log("=".repeat(80))
    failed.forEach((result) => {
      console.log(`   ${result.username} - ${result.error}`)
    })
    console.log("")
  }

  console.log("✨ Sub-admin creation process completed!\n")
  process.exit(successful.length === results.length ? 0 : 1)
}

// Run the script
createSubAdmins().catch((error) => {
  console.error("\n💥 Fatal error:", error)
  process.exit(1)
})
