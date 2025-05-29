export interface PetSitter {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage: string
  rating: number
  reviewCount: number
  experienceYears: number
  hourlyRate: number
  bio: string
  specialties: string[]
  languages: string[]
  education: string[]
  certifications: string[]
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  services: string[]
  location: {
    city: string
    state: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
    radius: number // service radius in miles
  }
  verified: boolean
  backgroundCheck: boolean
  insurance: boolean
  emergencyTrained: boolean
  petFirstAid: boolean
  responseTime: string // "within 1 hour", "within 2 hours", etc.
  cancellationPolicy: string
  pricing: {
    baseRate: number
    holidayRate: number
    lastMinuteRate: number
  }
  gallery: string[]
  joinedDate: string
  lastActive: string
  createdAt: string
  updatedAt: string
}

export interface Pet {
  id: string
  name: string
  type: "dog" | "cat" | "bird" | "rabbit" | "other"
  breed: string
  age: number
  weight: number
  gender: "male" | "female"
  spayed: boolean
  vaccinated: boolean
  microchipped: boolean
  specialNeeds: string[]
  medications: string[]
  allergies: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  vetInfo: {
    name: string
    phone: string
    address: string
  }
  profileImage: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  petId: string
  sitterId: string
  ownerId: string
  serviceType: string
  status: "pending" | "confirmed" | "ongoing" | "completed" | "cancelled"
  startDateTime: string
  endDateTime: string
  totalAmount: number
  paymentStatus: "pending" | "paid" | "refunded"
  specialInstructions: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  additionalServices: string[]
  createdAt: string
  updatedAt: string
  // Populated fields
  pet?: Pet
  sitter?: PetSitter
}

export interface Service {
  id: string
  name: string
  description: string
  basePrice: number
  duration: number // in minutes
  category: string
  icon: string
  active: boolean
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  pets: Pet[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  reviewerName: string
  reviewerImage: string
  sitterId: string
  rating: number
  comment: string
  serviceType: string
  petName: string
  createdAt: string
  helpful: number
  response?: {
    message: string
    createdAt: string
  }
}

export interface Availability {
  date: string
  timeSlots: {
    startTime: string
    endTime: string
    available: boolean
    price?: number
  }[]
}
