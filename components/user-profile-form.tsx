"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MapPin, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface UserProfileFormProps {
  onProfileSave?: (profile: UserProfile) => void
  initialProfile?: UserProfile | null
}

export default function UserProfileForm({ onProfileSave, initialProfile }: UserProfileFormProps) {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load existing profile from localStorage or use initialProfile
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (initialProfile) {
      setProfile(initialProfile)
    } else {
      // Generate a unique ID for new profile
      setProfile((prev) => ({
        ...prev,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }))
    }
  }, [initialProfile])

  const handleInputChange = (field: keyof Omit<UserProfile, "address">, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddressChange = (field: keyof UserProfile["address"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }))
  }

  const validateProfile = (): boolean => {
    const requiredFields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.address.street,
      profile.address.city,
      profile.address.state,
      profile.address.zipCode,
    ]

    return requiredFields.every((field) => field.trim() !== "")
  }

  const saveProfile = async () => {
    if (!validateProfile()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Save to localStorage (in real app, save to database)
      localStorage.setItem("userProfile", JSON.stringify(profile))

      // Call parent callback if provided
      onProfileSave?.(profile)

      toast({
        title: "Profile Saved",
        description: "Your profile and delivery address have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createNewProfile = () => {
    const newProfile: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
    }
    setProfile(newProfile)
    localStorage.removeItem("userProfile")

    toast({
      title: "New Profile Created",
      description: "You can now enter a different delivery address.",
    })
  }

  const hasExistingProfile = profile.name && profile.email

  return (
    <div className="space-y-6">
      {/* Single Address Policy Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Single Address Policy:</strong> Each profile can only have one delivery address. To use a different
          address, please create a new profile below.
        </AlertDescription>
      </Alert>

      {/* Existing Profile Display */}
      {hasExistingProfile && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <User className="h-5 w-5" />
              Existing Profile Found
            </CardTitle>
            <CardDescription className="text-green-700">
              Your saved profile and delivery address will be used for this order.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-green-800">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <div>
                <p>{profile.address.street}</p>
                <p>
                  {profile.address.city}, {profile.address.state} {profile.address.zipCode}
                </p>
                <p>{profile.address.country}</p>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={createNewProfile} variant="outline" size="sm">
                Create New Profile for Different Address
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {hasExistingProfile ? "Update Profile" : "Create Profile"}
          </CardTitle>
          <CardDescription>
            {hasExistingProfile
              ? "Update your profile information and delivery address."
              : "Enter your information and delivery address for orders."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pt-4 border-t">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Delivery Address</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Textarea
                id="street"
                value={profile.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="Enter your street address"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={profile.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={profile.address.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                placeholder="Enter country"
              />
            </div>
          </div>

          <Button onClick={saveProfile} className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : hasExistingProfile ? "Update Profile" : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
