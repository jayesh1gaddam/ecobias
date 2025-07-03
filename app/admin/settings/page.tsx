"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Copy, Save, Store } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StoreHours {
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface StoreSettings {
  name: string
  address: string
  phone: string
  email: string
  hours: {
    monday: StoreHours
    tuesday: StoreHours
    wednesday: StoreHours
    thursday: StoreHours
    friday: StoreHours
    saturday: StoreHours
    sunday: StoreHours
  }
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<StoreSettings>({
    name: "Luxury Perfumes",
    address: "123 Fragrance Street, Perfume City, PC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@luxuryperfumes.com",
    hours: {
      monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
      saturday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
      sunday: { isOpen: false, openTime: "10:00", closeTime: "17:00" },
    },
  })

  const [copyFromDay, setCopyFromDay] = useState<keyof typeof settings.hours>("monday")

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("storeSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleStoreInfoChange = (
    field: keyof Pick<StoreSettings, "name" | "address" | "phone" | "email">,
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHoursChange = (day: keyof typeof settings.hours, field: keyof StoreHours, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }))
  }

  const copyHoursToAllDays = () => {
    const sourceHours = settings.hours[copyFromDay]
    const updatedHours = { ...settings.hours }

    DAYS.forEach((day) => {
      if (day !== copyFromDay) {
        updatedHours[day] = { ...sourceHours }
      }
    })

    setSettings((prev) => ({
      ...prev,
      hours: updatedHours,
    }))

    toast({
      title: "Hours Copied",
      description: `${DAY_LABELS[copyFromDay]} hours copied to all other days.`,
    })
  }

  const saveSettings = async () => {
    try {
      // Save to localStorage (in real app, save to database)
      localStorage.setItem("storeSettings", JSON.stringify(settings))

      toast({
        title: "Settings Saved",
        description: "Store settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Store className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Store Settings</h1>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Manage your store's basic information and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.name}
                onChange={(e) => handleStoreInfoChange("name", e.target.value)}
                placeholder="Enter store name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleStoreInfoChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleStoreInfoChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Store Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => handleStoreInfoChange("address", e.target.value)}
              placeholder="Enter store address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Store Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Store Hours
          </CardTitle>
          <CardDescription>Set your store's operating hours for each day of the week.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Copy Hours Tool */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Label htmlFor="copyFrom">Copy from:</Label>
              <select
                id="copyFrom"
                value={copyFromDay}
                onChange={(e) => setCopyFromDay(e.target.value as keyof typeof settings.hours)}
                className="px-3 py-1 border rounded-md"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {DAY_LABELS[day]}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={copyHoursToAllDays} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy to All Days
            </Button>
          </div>

          {/* Daily Hours */}
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-24">
                  <Label className="font-medium">{DAY_LABELS[day]}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.hours[day].isOpen}
                    onCheckedChange={(checked) => handleHoursChange(day, "isOpen", checked)}
                  />
                  <Label className="text-sm">{settings.hours[day].isOpen ? "Open" : "Closed"}</Label>
                </div>

                {settings.hours[day].isOpen && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={settings.hours[day].openTime}
                      onChange={(e) => handleHoursChange(day, "openTime", e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={settings.hours[day].closeTime}
                      onChange={(e) => handleHoursChange(day, "closeTime", e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
