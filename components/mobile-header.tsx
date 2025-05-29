"use client"

import { Bell, Menu, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MobileHeaderProps {
  title: string
  showNotifications?: boolean
  showMenu?: boolean
}

export default function MobileHeader({ title, showNotifications = true, showMenu = false }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showMenu && (
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
          </div>
        </div>

        {showNotifications && (
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-red-500 text-white flex items-center justify-center">
              2
            </Badge>
          </Button>
        )}
      </div>
    </div>
  )
}
