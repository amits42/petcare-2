"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import MobileHeader from "@/components/mobile-header"
import { useAPI } from "@/lib/hooks/use-api"
import { PetCareAPI } from "@/lib/api/services"

function getStatusIcon(status: string) {
  switch (status) {
    case "confirmed":
      return <Clock className="w-4 h-4" />
    case "ongoing":
      return <AlertCircle className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "cancelled":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "ongoing":
      return "bg-green-100 text-green-800 border-green-200"
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch bookings using API
  const { data: bookings, loading, error, refetch } = useAPI(() => PetCareAPI.getUserBookings("user_001"), [])

  const filteredBookings = (bookings || []).filter((booking) => {
    const matchesSearch =
      booking.pet?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.sitter?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.sitter?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesTab = activeTab === "all" || booking.status === activeTab

    return matchesSearch && matchesStatus && matchesTab
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="My Bookings" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="My Bookings" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading bookings: {error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="My Bookings" />

      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header - Desktop Only */}
          <div className="mb-6 md:mb-8 hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your pet care appointments and services</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/book">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Book New Service
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Quick Action */}
          <div className="mb-4 md:hidden">
            <Link href="/book">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                <Plus className="w-5 h-5 mr-2" />
                Book New Service
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mb-4 md:mb-6">
            <div className="flex gap-2 mb-3 md:mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 md:h-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 md:h-10 px-3 md:hidden"
              >
                <Filter className="w-4 h-4" />
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
              <div className="hidden md:block">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="md:hidden">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Mobile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-5 h-12 md:h-10">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="text-xs md:text-sm">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="ongoing" className="text-xs md:text-sm">
                Ongoing
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-sm">
                Done
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs md:text-sm">
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Bookings List */}
              <div className="space-y-3 md:space-y-4">
                {filteredBookings.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                      <p className="text-gray-500 text-center">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "You don't have any bookings yet. Book your first pet care service!"}
                      </p>
                      <Link href="/book">
                        <Button className="mt-4">Book a Service</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  filteredBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        {/* Mobile Layout */}
                        <div className="md:hidden">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={booking.pet?.profileImage || "/placeholder.svg"}
                                alt={booking.pet?.name}
                              />
                              <AvatarFallback>{booking.pet?.name?.[0] || "P"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-base truncate">{booking.pet?.name}</h3>
                                <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 text-xs`}>
                                  {getStatusIcon(booking.status)}
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{booking.serviceType.replace("-", " ")}</p>
                              <div className="flex items-center gap-1 mb-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage
                                    src={booking.sitter?.profileImage || "/placeholder.svg"}
                                    alt={`${booking.sitter?.firstName} ${booking.sitter?.lastName}`}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {booking.sitter?.firstName?.[0]}
                                    {booking.sitter?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">
                                  {booking.sitter?.firstName} {booking.sitter?.lastName}
                                </span>
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-1" />
                                <span className="text-xs text-gray-600">{booking.sitter?.rating}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">{formatDate(booking.startDateTime)}</span>
                                </div>
                                <span className="font-semibold text-green-600">${booking.totalAmount}</span>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 h-9">
                              View Details
                            </Button>
                            {booking.status === "confirmed" && (
                              <Button variant="outline" size="sm" className="h-9">
                                Reschedule
                              </Button>
                            )}
                            {booking.status === "ongoing" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 h-9">
                                <Phone className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {/* Notes */}
                          {booking.specialInstructions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Notes:</strong> {booking.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:block">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Pet Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="w-16 h-16">
                                <AvatarImage
                                  src={booking.pet?.profileImage || "/placeholder.svg"}
                                  alt={booking.pet?.name}
                                />
                                <AvatarFallback>{booking.pet?.name?.[0] || "P"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">{booking.pet?.name}</h3>
                                <p className="text-gray-600">{booking.pet?.breed}</p>
                                <p className="text-sm text-gray-500">{booking.serviceType.replace("-", " ")}</p>
                              </div>
                            </div>

                            {/* Sitter Info */}
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={booking.sitter?.profileImage || "/placeholder.svg"}
                                  alt={`${booking.sitter?.firstName} ${booking.sitter?.lastName}`}
                                />
                                <AvatarFallback>
                                  {booking.sitter?.firstName?.[0]}
                                  {booking.sitter?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {booking.sitter?.firstName} {booking.sitter?.lastName}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-gray-600">{booking.sitter?.rating}</span>
                                </div>
                              </div>
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(booking.startDateTime)} - {formatDate(booking.endDateTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {booking.location.city}, {booking.location.state}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                                  {getStatusIcon(booking.status)}
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                                <span className="font-semibold text-green-600">${booking.totalAmount}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {booking.status === "confirmed" && (
                                <>
                                  <Button variant="outline" size="sm">
                                    Reschedule
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {booking.status === "ongoing" && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact
                                </Button>
                              )}
                              {booking.status === "completed" && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Notes */}
                          {booking.specialInstructions && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Notes:</strong> {booking.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-blue-600">
                  {(bookings || []).filter((b) => b.status === "confirmed").length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Upcoming</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-green-600">
                  {(bookings || []).filter((b) => b.status === "ongoing").length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Ongoing</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-gray-600">
                  {(bookings || []).filter((b) => b.status === "completed").length}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-600">
                  ${(bookings || []).reduce((sum, b) => sum + b.totalAmount, 0)}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Total Spent</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
