'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu } from "lucide-react"
import { removeAuthToken } from "@/utils/auth"

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            D
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            DonateNow
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Button onClick={removeAuthToken} className="bg-red-700 hover:bg-red-800 text-white" asChild>
            <Link href="/login">Logout</Link>
          </Button>
        </nav>
        <div className="flex md:hidden items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}

