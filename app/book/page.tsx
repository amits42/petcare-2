"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  MapPin,
  Heart,
  Star,
  ArrowLeft,
  ArrowRight,
  Check,
  DollarSign,
  CreditCard,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import MobileHeader from "@/components/mobile-header"
import SitterProfileModal from "@/components/sitter-profile-modal"
import { useAPI } from "@/lib/hooks/use-api"
import { PetCareAPI } from "@/lib/api/services"
import { useSearchParams } from "next/navigation"

interface FormData {
  petId: string
  serviceType: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  address: string
  city: string
  zipCode: string
  specialInstructions: string
  additionalServices: string[]
  paymentMethod: string
}

const additionalServices = [
  { id: "feeding", name: "Feeding", price: 50 },
  { id: "medication", name: "Medication Administration", price: 100 },
  { id: "playtime", name: "Extended Playtime", price: 150 },
  { id: "photos", name: "Photo Updates", price: 50 },
  { id: "training", name: "Basic Training", price: 200 },
]

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSitter, setSelectedSitter] = useState<string>("")
  const [selectedSitterForModal, setSelectedSitterForModal] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    petId: "",
    serviceType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    address: "",
    city: "",
    zipCode: "",
    specialInstructions: "",
    additionalServices: [],
    paymentMethod: "",
  })
  const [isAvailableMap, setIsAvailableMap] = useState<{ [sitterId: string]: boolean | null }>({})
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  // URL parameter handling for pre-selected sitter
  const searchParams = useSearchParams()
  const preSelectedSitter = searchParams?.get("sitter")

  // Fetch data using APIs
  const { data: services, loading: servicesLoading } = useAPI(() => PetCareAPI.getServices(), [])
  const { data: pets, loading: petsLoading } = useAPI(() => PetCareAPI.getUserPets("user_001"), [])
  const { data: sitters, loading: sittersLoading } = useAPI(
    () => PetCareAPI.getSitters({ serviceType: formData.serviceType }),
    [formData.serviceType],
  )

  // Check availability for all sitters when date/time changes
  useEffect(() => {
    const checkAllSittersAvailability = async () => {
      if (sitters && formData.startDate && formData.startTime && formData.endTime) {
        setCheckingAvailability(true)
        const availabilityPromises = sitters.map(async (sitter) => {
          try {
            const isAvailable = await PetCareAPI.checkAvailability(
              sitter.id,
              formData.startDate,
              formData.startTime,
              formData.endTime,
            )
            return { sitterId: sitter.id, isAvailable }
          } catch (error) {
            console.error(`Error checking availability for sitter ${sitter.id}:`, error)
            return { sitterId: sitter.id, isAvailable: false }
          }
        })

        const results = await Promise.all(availabilityPromises)
        const newAvailabilityMap: { [sitterId: string]: boolean | null } = {}

        results.forEach(({ sitterId, isAvailable }) => {
          newAvailabilityMap[sitterId] = isAvailable
        })

        setIsAvailableMap(newAvailabilityMap)
        setCheckingAvailability(false)
      } else {
        // Reset availability if no date/time selected
        setIsAvailableMap({})
      }
    }

    checkAllSittersAvailability()
  }, [sitters, formData.startDate, formData.startTime, formData.endTime])

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleAdditionalService = (serviceId: string) => {
    const current = formData.additionalServices
    const updated = current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId]
    updateFormData("additionalServices", updated)
  }

  const calculateTotal = () => {
    const selectedService = services?.find((s) => s.id === formData.serviceType)
    const basePrice = selectedService?.basePrice || 0
    const additionalPrice = formData.additionalServices.reduce((sum, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId)
      return sum + (service?.price || 0)
    }, 0)
    const sitterPrice = selectedSitter ? sitters?.find((s) => s.id === selectedSitter)?.hourlyRate || 0 : 0
    return basePrice + additionalPrice + sitterPrice
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleViewProfile = (sitterId: string) => {
    setSelectedSitterForModal(sitterId)
    setIsModalOpen(true)
  }

  const handleBookFromModal = (sitterId: string) => {
    setSelectedSitter(sitterId)
    setIsModalOpen(false)
    setSelectedSitterForModal(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSitterForModal(null)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 5 && <div className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Select Your Pet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {petsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading your pets...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets?.map((pet) => (
              <div
                key={pet.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.petId === pet.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => updateFormData("petId", pet.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={pet.profileImage || "/placeholder.svg"} alt={pet.name} />
                    <AvatarFallback>{pet.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                    <p className="text-xs text-gray-500">{pet.age} years old</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Service & Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Select Service *</Label>
          {servicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading services...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services?.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.serviceType === service.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => updateFormData("serviceType", service.id)}
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-600">{Math.floor(service.duration / 60)} hours</p>
                  <p className="text-lg font-semibold text-green-600">₹{service.basePrice}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData("startDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => updateFormData("startTime", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData("endDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => updateFormData("endTime", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-4 block">Additional Services</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {additionalServices.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox
                  id={service.id}
                  checked={formData.additionalServices.includes(service.id)}
                  onCheckedChange={() => toggleAdditionalService(service.id)}
                />
                <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                  {service.name} (+₹{service.price})
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Location & Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData("address", e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData("city", e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="zipCode">PIN Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => updateFormData("zipCode", e.target.value)}
              placeholder="PIN Code"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specialInstructions">Special Instructions</Label>
          <Textarea
            id="specialInstructions"
            value={formData.specialInstructions}
            onChange={(e) => updateFormData("specialInstructions", e.target.value)}
            placeholder="Any specific instructions for the sitter..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Choose Your Sitter
          {checkingAvailability && (
            <div className="flex items-center gap-2 ml-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Checking availability...</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sittersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Finding available sitters...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {sitters?.map((sitter) => {
              const isAvailable = isAvailableMap[sitter.id]
              const hasDateTimeSelected = formData.startDate && formData.startTime && formData.endTime

              return (
                <div
                  key={sitter.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSitter === sitter.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${isAvailable === false ? "opacity-75" : ""}`}
                  onClick={() => isAvailable !== false && setSelectedSitter(sitter.id)}
                >
                  <div className="flex items-center gap-4">
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
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {sitter.firstName} {sitter.lastName}
                        </h3>
                        {sitter.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {hasDateTimeSelected && isAvailable === false && (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                        {hasDateTimeSelected && isAvailable === true && (
                          <Badge className="bg-green-100 text-green-800">Available</Badge>
                        )}
                        {checkingAvailability && hasDateTimeSelected && isAvailable === null && (
                          <Badge variant="secondary">Checking...</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{sitter.rating}</span>
                          <span className="text-gray-600">({sitter.reviewCount} reviews)</span>
                        </div>
                        <Badge variant="secondary">{sitter.experienceYears}+ years</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {sitter.specialties.slice(0, 4).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-lg font-semibold text-green-600">₹{sitter.hourlyRate}/hour</p>
                      {hasDateTimeSelected && isAvailable === false && (
                        <p className="text-sm text-red-600 mt-1">Not available for selected date/time</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewProfile(sitter.id)
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep5 = () => {
    const selectedService = services?.find((s) => s.id === formData.serviceType)
    const selectedPet = pets?.find((p) => p.id === formData.petId)
    const selectedSitterData = sitters?.find((s) => s.id === selectedSitter)

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Pet Information</h3>
                <p>
                  <strong>Name:</strong> {selectedPet?.name}
                </p>
                <p>
                  <strong>Type:</strong> {selectedPet?.type}
                </p>
                <p>
                  <strong>Breed:</strong> {selectedPet?.breed}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Details</h3>
                <p>
                  <strong>Service:</strong> {selectedService?.name}
                </p>
                <p>
                  <strong>Date:</strong> {formData.startDate}
                </p>
                <p>
                  <strong>Time:</strong> {formData.startTime} - {formData.endTime}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Service</span>
                  <span>₹{selectedService?.basePrice || 0}</span>
                </div>
                {formData.additionalServices.map((serviceId) => {
                  const service = additionalServices.find((s) => s.id === serviceId)
                  return (
                    <div key={serviceId} className="flex justify-between">
                      <span>{service?.name}</span>
                      <span>+₹{service?.price}</span>
                    </div>
                  )
                })}
                {selectedSitter && (
                  <div className="flex justify-between">
                    <span>Sitter Rate</span>
                    <span>+₹{selectedSitterData?.hourlyRate}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => updateFormData("paymentMethod", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi">UPI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking">Net Banking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet">Digital Wallet</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    )
  }

  useEffect(() => {
    if (preSelectedSitter && sitters) {
      const sitter = sitters.find((s) => s.id === preSelectedSitter)
      if (sitter) {
        setSelectedSitter(preSelectedSitter)
        // Skip to sitter selection step if coming from sitter profile
        setCurrentStep(4)
      }
    }
  }, [preSelectedSitter, sitters])

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="Book Service" />

      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 hidden md:block">Book Pet Care Service</h1>
            <p className="text-gray-600 hidden md:block">Find the perfect care for your beloved pet</p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="/bookings">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Bookings
                </Button>
              </Link>
            </div>
          </div>

          {renderStepIndicator()}

          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
                disabled={
                  (currentStep === 1 && !formData.petId) ||
                  (currentStep === 2 && (!formData.serviceType || !formData.startDate || !formData.startTime)) ||
                  (currentStep === 3 && (!formData.address || !formData.city || !formData.zipCode)) ||
                  (currentStep === 4 && !selectedSitter)
                }
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                disabled={!formData.paymentMethod}
                onClick={async () => {
                  // Here you would call the API to create the booking
                  try {
                    const bookingData = {
                      petId: formData.petId,
                      sitterId: selectedSitter,
                      ownerId: "user_001",
                      serviceType: formData.serviceType,
                      startDateTime: `${formData.startDate}T${formData.startTime}:00Z`,
                      endDateTime: `${formData.endDate}T${formData.endTime}:00Z`,
                      totalAmount: calculateTotal(),
                      specialInstructions: formData.specialInstructions,
                      location: {
                        address: formData.address,
                        city: formData.city,
                        state: "Karnataka",
                        zipCode: formData.zipCode,
                      },
                      additionalServices: formData.additionalServices,
                    }

                    const newBooking = await PetCareAPI.createBooking(bookingData)
                    // Redirect to success page or bookings page
                    window.location.href = "/bookings"
                  } catch (error) {
                    console.error("Failed to create booking:", error)
                  }
                }}
              >
                <DollarSign className="w-4 h-4" />
                Confirm Booking (₹{calculateTotal()})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sitter Profile Modal */}
      <SitterProfileModal
        sitterId={selectedSitterForModal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookNow={handleBookFromModal}
      />
    </div>
  )
}
