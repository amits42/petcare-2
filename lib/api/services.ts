import type { PetSitter, Pet, Booking, Service, User, Review, Availability } from "./types"
import { mockSitters, mockPets, mockBookings, mockServices, mockUser, mockReviews, mockAvailability } from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class PetCareAPI {
  // Sitters API
  static async getSitters(filters?: {
    city?: string
    serviceType?: string
    minRating?: number
    maxRate?: number
  }): Promise<PetSitter[]> {
    await delay(500) // Simulate network delay

    let filteredSitters = [...mockSitters]

    if (filters?.city) {
      filteredSitters = filteredSitters.filter((sitter) =>
        sitter.location.city.toLowerCase().includes(filters.city!.toLowerCase()),
      )
    }

    if (filters?.serviceType) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.services.includes(filters.serviceType!))
    }

    if (filters?.minRating) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.rating >= filters.minRating!)
    }

    if (filters?.maxRate) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.hourlyRate <= filters.maxRate!)
    }

    return filteredSitters
  }

  static async getSitterById(id: string): Promise<PetSitter | null> {
    await delay(300)
    return mockSitters.find((sitter) => sitter.id === id) || null
  }

  // Pets API
  static async getUserPets(userId: string): Promise<Pet[]> {
    await delay(400)
    return mockPets.filter((pet) => pet.ownerId === userId)
  }

  static async getPetById(id: string): Promise<Pet | null> {
    await delay(200)
    return mockPets.find((pet) => pet.id === id) || null
  }

  // Bookings API
  static async getUserBookings(userId: string): Promise<Booking[]> {
    await delay(600)
    const userBookings = mockBookings.filter((booking) => booking.ownerId === userId)

    // Populate with pet and sitter data
    return userBookings.map((booking) => ({
      ...booking,
      pet: mockPets.find((pet) => pet.id === booking.petId),
      sitter: mockSitters.find((sitter) => sitter.id === booking.sitterId),
    }))
  }

  static async getBookingById(id: string): Promise<Booking | null> {
    await delay(300)
    const booking = mockBookings.find((booking) => booking.id === id)
    if (!booking) return null

    return {
      ...booking,
      pet: mockPets.find((pet) => pet.id === booking.petId),
      sitter: mockSitters.find((sitter) => sitter.id === booking.sitterId),
    }
  }

  static async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    await delay(800)

    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      petId: bookingData.petId!,
      sitterId: bookingData.sitterId!,
      ownerId: bookingData.ownerId!,
      serviceType: bookingData.serviceType!,
      status: "pending",
      startDateTime: bookingData.startDateTime!,
      endDateTime: bookingData.endDateTime!,
      totalAmount: bookingData.totalAmount!,
      paymentStatus: "pending",
      specialInstructions: bookingData.specialInstructions || "",
      location: bookingData.location!,
      additionalServices: bookingData.additionalServices || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In real app, this would save to database
    mockBookings.push(newBooking)

    return {
      ...newBooking,
      pet: mockPets.find((pet) => pet.id === newBooking.petId),
      sitter: mockSitters.find((sitter) => sitter.id === newBooking.sitterId),
    }
  }

  static async updateBookingStatus(id: string, status: Booking["status"]): Promise<Booking | null> {
    await delay(400)

    const bookingIndex = mockBookings.findIndex((booking) => booking.id === id)
    if (bookingIndex === -1) return null

    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    const booking = mockBookings[bookingIndex]
    return {
      ...booking,
      pet: mockPets.find((pet) => pet.id === booking.petId),
      sitter: mockSitters.find((sitter) => sitter.id === booking.sitterId),
    }
  }

  // Services API
  static async getServices(): Promise<Service[]> {
    await delay(300)
    return mockServices.filter((service) => service.active)
  }

  static async getServiceById(id: string): Promise<Service | null> {
    await delay(200)
    return mockServices.find((service) => service.id === id) || null
  }

  // User API
  static async getCurrentUser(): Promise<User> {
    await delay(400)
    return mockUser
  }

  static async updateUser(userData: Partial<User>): Promise<User> {
    await delay(500)
    // In real app, this would update the database
    return {
      ...mockUser,
      ...userData,
      updatedAt: new Date().toISOString(),
    }
  }

  // Reviews API
  static async getSitterReviews(sitterId: string): Promise<Review[]> {
    await delay(400)
    return mockReviews
      .filter((review) => review.sitterId === sitterId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Availability API
  static async getSitterAvailability(sitterId: string, startDate: string, endDate: string): Promise<Availability[]> {
    await delay(500)
    return mockAvailability[sitterId] || []
  }

  static async checkAvailability(sitterId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
    await delay(300)
    const availability = mockAvailability[sitterId]
    if (!availability) return false

    const dayAvailability = availability.find((day) => day.date === date)
    if (!dayAvailability) return false

    // Check if the requested time slot overlaps with any available slot
    return dayAvailability.timeSlots.some((slot) => {
      if (!slot.available) return false

      // Convert times to minutes for easier comparison
      const slotStart =
        Number.parseInt(slot.startTime.split(":")[0]) * 60 + Number.parseInt(slot.startTime.split(":")[1])
      const slotEnd = Number.parseInt(slot.endTime.split(":")[0]) * 60 + Number.parseInt(slot.endTime.split(":")[1])
      const requestStart = Number.parseInt(startTime.split(":")[0]) * 60 + Number.parseInt(startTime.split(":")[1])
      const requestEnd = Number.parseInt(endTime.split(":")[0]) * 60 + Number.parseInt(endTime.split(":")[1])

      // Check if requested time fits within available slot
      return requestStart >= slotStart && requestEnd <= slotEnd
    })
  }

  // Enhanced Sitters API with search and filters
  static async searchSitters(params: {
    query?: string
    city?: string
    serviceType?: string
    minRating?: number
    maxRate?: number
    date?: string
    startTime?: string
    endTime?: string
    specialties?: string[]
    verified?: boolean
    emergencyTrained?: boolean
    petFirstAid?: boolean
  }): Promise<PetSitter[]> {
    await delay(600)

    let filteredSitters = [...mockSitters]

    // Text search
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredSitters = filteredSitters.filter(
        (sitter) =>
          sitter.firstName.toLowerCase().includes(query) ||
          sitter.lastName.toLowerCase().includes(query) ||
          sitter.bio.toLowerCase().includes(query) ||
          sitter.specialties.some((specialty) => specialty.toLowerCase().includes(query)),
      )
    }

    // Location filter
    if (params.city) {
      filteredSitters = filteredSitters.filter((sitter) =>
        sitter.location.city.toLowerCase().includes(params.city!.toLowerCase()),
      )
    }

    // Service type filter
    if (params.serviceType) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.services.includes(params.serviceType!))
    }

    // Rating filter
    if (params.minRating) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.rating >= params.minRating!)
    }

    // Rate filter
    if (params.maxRate) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.hourlyRate <= params.maxRate!)
    }

    // Specialties filter
    if (params.specialties && params.specialties.length > 0) {
      filteredSitters = filteredSitters.filter((sitter) =>
        params.specialties!.some((specialty) => sitter.specialties.includes(specialty)),
      )
    }

    // Verification filters
    if (params.verified) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.verified)
    }

    if (params.emergencyTrained) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.emergencyTrained)
    }

    if (params.petFirstAid) {
      filteredSitters = filteredSitters.filter((sitter) => sitter.petFirstAid)
    }

    // Availability filter - this is the key part
    if (params.date && params.startTime && params.endTime) {
      const availableSitters = []
      for (const sitter of filteredSitters) {
        const isAvailable = await this.checkAvailability(sitter.id, params.date, params.startTime, params.endTime)
        if (isAvailable) {
          availableSitters.push(sitter)
        }
      }
      filteredSitters = availableSitters
    }

    return filteredSitters
  }
}
