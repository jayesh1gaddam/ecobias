import React from "react"

interface SalesData {
  month: string
  sales: number
}

export default function AnalyticsChart({ salesData }: { salesData: SalesData[] }) {
  const max = Math.max(...salesData.map(d => d.sales), 1)
  return (
    <div className="w-full h-64 flex items-end gap-4">
      {salesData.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="bg-[var(--color-accent)] rounded-t-lg transition-all duration-300"
            style={{ height: `${(d.sales / max) * 180 + 10}px`, width: "32px" }}
            title={`₹${d.sales.toLocaleString()}`}
          ></div>
          <span className="text-xs mt-2">{d.month}</span>
        </div>
      ))}
    </div>
  )
} 