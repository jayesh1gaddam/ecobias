"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, Package, Users, BarChart3 } from "lucide-react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined" && pathname !== "/admin/login") {
      if (localStorage.getItem("isAdminAuthed") !== "true") {
        router.replace("/admin/login")
      }
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="px-4 space-y-2">
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Store Settings
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
            </Link>
          </nav>
          <nav className="mb-6">
            <ul className="flex flex-wrap gap-4 text-sm">
              <li><a href="/admin/products" className="hover:underline">Products</a></li>
              <li><a href="/admin/orders" className="hover:underline">Orders</a></li>
              <li><a href="/admin/analytics" className="hover:underline">Analytics</a></li>
              <li><a href="/admin/premium-users" className="hover:underline">Premium Users</a></li>
              <li><a href="/admin/settings" className="hover:underline">Settings</a></li>
              <li><a href="/admin/users" className="hover:underline">Users</a></li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
