import Image from "next/image"
import { Heart, Star, Shield } from "lucide-react"

export default function Component() {
  return (
    <div className="w-full">
      {/* Hero Image Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <Image
          src="/placeholder.svg?height=500&width=800"
          alt="Professional pet care - Happy pets with caring sitters"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay with branding */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Trusted Pet Care Bookings</h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 opacity-90">
              Connect with verified pet sitters in your area
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Verified Sitters</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-400 text-red-400" />
                <span className="text-xs sm:text-sm font-medium">Pet Lovers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative smaller banner version */}
      <div className="mt-8 relative w-full h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
        <Image
          src="/placeholder.svg?height=200&width=800"
          alt="Pet care booking banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-600/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Book Your Pet's Perfect Sitter</h2>
            <p className="text-xs sm:text-sm md:text-base opacity-90">
              Safe, reliable, and loving care for your furry friends
            </p>
          </div>
        </div>
      </div>

      {/* Compact card version */}
      <div className="mt-8 relative w-full h-24 sm:h-28 md:h-32 overflow-hidden rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
        <Image
          src="/placeholder.svg?height=150&width=600"
          alt="Pet care services"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">Professional Pet Care</h3>
            <p className="text-xs sm:text-sm text-gray-600">Trusted by pet parents everywhere</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-800">4.9</span>
          </div>
        </div>
      </div>
    </div>
  )
}
