"use client"

import { useState, useEffect } from "react"
import { Search, Star, MapPin, Shield, Heart, ChevronDown, SlidersHorizontal, CheckCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MobileHeader from "@/components/mobile-header"
import SitterProfileModal from "@/components/sitter-profile-modal"
import { useAPI } from "@/lib/hooks/use-api"
import { PetCareAPI } from "@/lib/api/services"

export default function SittersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSitterId, setSelectedSitterId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    city: "",
    serviceType: "",
    minRating: 0,
    maxRate: 2000, // Updated for Indian pricing
    specialties: [] as string[],
    verified: false,
    emergencyTrained: false,
    petFirstAid: false,
    date: "",
    startTime: "",
    endTime: "",
  })

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: sitters,
    loading,
    error,
    refetch,
  } = useAPI(
    () =>
      PetCareAPI.searchSitters({
        query: debouncedQuery,
        ...filters,
        specialties: filters.specialties.length > 0 ? filters.specialties : undefined,
      }),
    [debouncedQuery, filters],
  )

  const { data: services } = useAPI(() => PetCareAPI.getServices(), [])

  const specialtyOptions = [
    "Dogs",
    "Cats",
    "Small Animals",
    "Large Breeds",
    "Puppies",
    "Senior Pets",
    "Special Needs",
    "Exotic Pets",
    "Behavioral Training",
  ]

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleSpecialty = (specialty: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const clearFilters = () => {
    setFilters({
      city: "",
      serviceType: "",
      minRating: 0,
      maxRate: 2000,
      specialties: [],
      verified: false,
      emergencyTrained: false,
      petFirstAid: false,
      date: "",
      startTime: "",
      endTime: "",
    })
    setSearchQuery("")
  }

  const handleViewProfile = (sitterId: string) => {
    setSelectedSitterId(sitterId)
    setIsModalOpen(true)
  }

  const handleBookNow = (sitterId: string) => {
    router.push(`/book?sitter=${sitterId}`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSitterId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="Find Sitters" />

      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Pet Sitters</h1>
            <p className="text-gray-600">Discover trusted and verified pet care professionals in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
              <div className="text-sm text-gray-600">
                {loading ? "Searching..." : `${sitters?.length || 0} sitters found`}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Location */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Location</Label>
                      <Input
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => updateFilter("city", e.target.value)}
                      />
                    </div>

                    {/* Service Type */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Service Type</Label>
                      <Select value={filters.serviceType} onValueChange={(value) => updateFilter("serviceType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any service</SelectItem>
                          {services?.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Minimum Rating: {filters.minRating}★</Label>
                      <Slider
                        value={[filters.minRating]}
                        onValueChange={([value]) => updateFilter("minRating", value)}
                        max={5}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Max Rate: ${filters.maxRate}/hour</Label>
                      <Slider
                        value={[filters.maxRate]}
                        onValueChange={([value]) => updateFilter("maxRate", value)}
                        max={2000}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Availability */}
                    <div className="md:col-span-2">
                      <Label className="text-base font-medium mb-3 block">Check Availability</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="date"
                          value={filters.date}
                          onChange={(e) => updateFilter("date", e.target.value)}
                        />
                        <Input
                          type="time"
                          value={filters.startTime}
                          onChange={(e) => updateFilter("startTime", e.target.value)}
                        />
                        <Input
                          type="time"
                          value={filters.endTime}
                          onChange={(e) => updateFilter("endTime", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="md:col-span-3">
                      <Label className="text-base font-medium mb-3 block">Specialties</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {specialtyOptions.map((specialty) => (
                          <div key={specialty} className="flex items-center space-x-2">
                            <Checkbox
                              id={specialty}
                              checked={filters.specialties.includes(specialty)}
                              onCheckedChange={() => toggleSpecialty(specialty)}
                            />
                            <Label htmlFor={specialty} className="text-sm cursor-pointer">
                              {specialty}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification Filters */}
                    <div className="md:col-span-3">
                      <Label className="text-base font-medium mb-3 block">Verification & Training</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="verified"
                            checked={filters.verified}
                            onCheckedChange={(checked) => updateFilter("verified", checked)}
                          />
                          <Label htmlFor="verified" className="text-sm cursor-pointer">
                            Verified Sitters Only
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="emergencyTrained"
                            checked={filters.emergencyTrained}
                            onCheckedChange={(checked) => updateFilter("emergencyTrained", checked)}
                          />
                          <Label htmlFor="emergencyTrained" className="text-sm cursor-pointer">
                            Emergency Trained
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="petFirstAid"
                            checked={filters.petFirstAid}
                            onCheckedChange={(checked) => updateFilter("petFirstAid", checked)}
                          />
                          <Label htmlFor="petFirstAid" className="text-sm cursor-pointer">
                            Pet First Aid Certified
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                    <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-red-600 mb-4">Error loading sitters: {error}</p>
                <Button onClick={refetch}>Try Again</Button>
              </CardContent>
            </Card>
          ) : sitters?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sitters found</h3>
                <p className="text-gray-500 text-center mb-4">
                  Try adjusting your search criteria or filters to find more sitters.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sitters?.map((sitter) => (
                <Card key={sitter.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={sitter.profileImage || "/placeholder.svg"}
                          alt={`${sitter.firstName} ${sitter.lastName}`}
                        />
                        <AvatarFallback>
                          {sitter.firstName[0]}
                          {sitter.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {sitter.firstName} {sitter.lastName}
                          </h3>
                          {sitter.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{sitter.rating}</span>
                            <span className="text-gray-600 text-sm">({sitter.reviewCount})</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {sitter.experienceYears}+ years
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {sitter.location.city}, {sitter.location.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {sitter.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {sitter.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{sitter.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{sitter.bio}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">${sitter.hourlyRate}</div>
                          <div className="text-xs text-gray-500">per hour</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-600">{sitter.responseTime}</div>
                          <div className="text-xs text-gray-500">response</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {sitter.backgroundCheck && (
                          <Shield className="w-4 h-4 text-blue-500" title="Background Check" />
                        )}
                        {sitter.petFirstAid && <Award className="w-4 h-4 text-green-500" title="Pet First Aid" />}
                        {sitter.emergencyTrained && (
                          <Heart className="w-4 h-4 text-red-500" title="Emergency Trained" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleViewProfile(sitter.id)}>
                        View Profile
                      </Button>
                      <Link href={`/book?sitter=${sitter.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                      </Link>
                    </div>

                    {/* Availability indicator */}
                    {filters.date && filters.startTime && filters.endTime && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                          <CheckCircle className="w-4 h-4" />
                          <span>Available for selected time</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <SitterProfileModal
        sitterId={selectedSitterId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookNow={handleBookNow}
      />
    </div>
  )
}
