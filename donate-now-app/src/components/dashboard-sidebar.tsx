"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, Users, Settings, LogOut, Heart, CreditCard, Bell, HelpCircle } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart3, label: "My Campaigns", path: "/dashboard/campaigns" },
    { icon: Heart, label: "My Donations", path: "/dashboard/donations" },
    { icon: CreditCard, label: "Payment Methods", path: "/dashboard/payments" },
    { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
    { icon: Users, label: "Referrals", path: "/dashboard/referrals" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/dashboard/support" },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <span className="font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            DonateNow
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <button className="flex items-center space-x-2 px-4 py-2.5 w-full rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

