import Link from "next/link"
import { Calendar, Plus, Star, Shield, Heart, ArrowRight, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MobileHeader from "@/components/mobile-header"

export default function HomePage() {
  const stats = [
    { label: "Happy Pets", value: "10K+", icon: Heart },
    { label: "Verified Sitters", value: "500+", icon: Shield },
    { label: "5-Star Reviews", value: "8.5K+", icon: Star },
  ]

  const quickActions = [
    {
      title: "Book a Service",
      description: "Find the perfect sitter",
      href: "/book",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      badge: "Popular",
    },
    {
      title: "View Bookings",
      description: "Manage appointments",
      href: "/bookings",
      icon: Calendar,
      color: "bg-green-600 hover:bg-green-700",
      badge: "3 Active",
    },
  ]

  const recentActivity = [
    {
      title: "Upcoming Walk",
      subtitle: "Max with Sarah",
      time: "Tomorrow 9:00 AM",
      status: "upcoming",
      icon: Clock,
    },
    {
      title: "Review Pending",
      subtitle: "Rate Mike's service",
      time: "Action needed",
      status: "action",
      icon: Star,
    },
    {
      title: "New Sitter",
      subtitle: "Emma nearby",
      time: "Just now",
      status: "new",
      icon: MapPin,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="PetCare" />

      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="px-4 py-8 md:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">
              Trusted Pet Care
              <br />
              <span className="text-blue-200">When You Need It</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 text-blue-100 max-w-3xl mx-auto px-4">
              Connect with verified, loving pet sitters in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link href="/book" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-3 h-12 md:h-auto"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/bookings" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 text-base md:text-lg px-6 md:px-8 py-3 h-12 md:h-auto"
                >
                  View Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Mobile Grid */}
      <div className="py-8 md:py-16 bg-white">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full mb-2 md:mb-4">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-xs md:text-base text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile Cards */}
      <div className="py-8 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Quick Actions</h2>
            <p className="text-base md:text-xl text-gray-600">Get started with our most popular actions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full relative">
                    <CardContent className="p-6 md:p-8 text-center">
                      {action.badge && (
                        <Badge className="absolute top-4 right-4 bg-orange-100 text-orange-800">{action.badge}</Badge>
                      )}
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full mb-4 md:mb-6 ${action.color}`}
                      >
                        <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">{action.title}</h3>
                      <p className="text-gray-600 mb-4 md:mb-6">{action.description}</p>
                      <Button className={`w-full md:w-auto ${action.color}`}>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity - Mobile List */}
      <div className="py-8 md:py-16 bg-white px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Activity</h2>
            <Link href="/bookings">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3 md:hidden">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === "upcoming"
                          ? "bg-blue-100"
                          : activity.status === "action"
                            ? "bg-orange-100"
                            : "bg-green-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          activity.status === "upcoming"
                            ? "text-blue-600"
                            : activity.status === "action"
                              ? "text-orange-600"
                              : "text-green-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{activity.title}</h3>
                      <p className="text-xs text-gray-600">{activity.subtitle}</p>
                    </div>
                    <Badge
                      className={`text-xs ${
                        activity.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : activity.status === "action"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {activity.time}
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          activity.status === "upcoming"
                            ? "bg-blue-100"
                            : activity.status === "action"
                              ? "bg-orange-100"
                              : "bg-green-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            activity.status === "upcoming"
                              ? "text-blue-600"
                              : activity.status === "action"
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.subtitle}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        activity.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : activity.status === "action"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {activity.time}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
