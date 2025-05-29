"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Plus, Home, User, Settings, Heart, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/sitters", label: "Find Sitters", icon: Search },
    { href: "/bookings", label: "My Bookings", icon: Calendar },
    { href: "/book", label: "Book Service", icon: Plus },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-sm border-b hidden md:block">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PetCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center gap-2 ${
                      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {item.href === "/bookings" && (
                      <Badge variant="secondary" className="ml-1">
                        3
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
            <Button variant="ghost" size="sm" className="ml-4 relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                2
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
