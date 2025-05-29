"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Plus, Home, User, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MobileNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/sitters", label: "Sitters", icon: Search },
    { href: "/book", label: "Book", icon: Plus },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 relative ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.href === "/bookings" && (
                    <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                      3
                    </Badge>
                  )}
                  {item.href === "/book" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full"></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for mobile navigation */}
      <div className="h-16 md:hidden"></div>
    </>
  )
}
