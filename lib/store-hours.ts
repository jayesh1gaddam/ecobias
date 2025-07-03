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

export function getStoreSettings(): StoreSettings | null {
  if (typeof window === "undefined") return null

  const settings = localStorage.getItem("storeSettings")
  return settings ? JSON.parse(settings) : null
}

export function isStoreOpen(): { isOpen: boolean; message: string; nextOpenTime?: string } {
  const settings = getStoreSettings()
  if (!settings) {
    return { isOpen: true, message: "Store hours not configured" }
  }

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().substring(0, 3) // mon, tue, etc.
  const currentTime = now.toTimeString().substring(0, 5) // HH:MM format

  // Map day abbreviations to full day names
  const dayMap: { [key: string]: keyof typeof settings.hours } = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
  }

  const todayKey = dayMap[currentDay]
  const todayHours = settings.hours[todayKey]

  if (!todayHours.isOpen) {
    const nextOpenDay = findNextOpenDay(settings.hours, todayKey) || ""
    return {
      isOpen: false,
      message: `Store is closed today. ${nextOpenDay ? `Next open: ${nextOpenDay}` : "Please check back later."}`,
      nextOpenTime: nextOpenDay,
    }
  }

  // Check if current time is within store hours
  if (currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime) {
    return {
      isOpen: true,
      message: `Store is open until ${formatTime(todayHours.closeTime)}`,
    }
  }

  // Store is closed for the day
  if (currentTime < todayHours.openTime) {
    return {
      isOpen: false,
      message: `Store opens at ${formatTime(todayHours.openTime)} today`,
      nextOpenTime: `Today at ${formatTime(todayHours.openTime)}`,
    }
  }

  // Store has closed for the day
  const nextOpenDay = findNextOpenDay(settings.hours, todayKey) || ""
  return {
    isOpen: false,
    message: `Store is closed. ${nextOpenDay ? `Next open: ${nextOpenDay}` : "Please check back later."}`,
    nextOpenTime: nextOpenDay,
  }
}

function findNextOpenDay(hours: StoreSettings["hours"], currentDay: keyof typeof hours): string | null {
  const days: (keyof typeof hours)[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  const currentIndex = days.indexOf(currentDay)

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentIndex + i) % 7
    const nextDay = days[nextDayIndex]
    const nextDayHours = hours[nextDay]

    if (nextDayHours.isOpen) {
      const dayLabel = i === 1 ? "Tomorrow" : dayLabels[nextDay]
      return `${dayLabel} at ${formatTime(nextDayHours.openTime)}`
    }
  }

  return null
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
