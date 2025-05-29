"use client"
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Heart,
  MessageCircle,
  Calendar,
  Award,
  CheckCircle,
  Camera,
  ThumbsUp,
  Globe,
  GraduationCap,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useAPI } from "@/lib/hooks/use-api"
import { PetCareAPI } from "@/lib/api/services"

interface SitterProfileModalProps {
  sitterId: string | null
  isOpen: boolean
  onClose: () => void
  onBookNow?: (sitterId: string) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatJoinDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  })
}

export default function SitterProfileModal({ sitterId, isOpen, onClose, onBookNow }: SitterProfileModalProps) {
  const { data: sitter, loading: sitterLoading } = useAPI(
    () => (sitterId ? PetCareAPI.getSitterById(sitterId) : Promise.resolve(null)),
    [sitterId],
  )
  const { data: reviews, loading: reviewsLoading } = useAPI(
    () => (sitterId ? PetCareAPI.getSitterReviews(sitterId) : Promise.resolve([])),
    [sitterId],
  )

  if (!sitterId || !sitter) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Sitter Profile</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {sitterLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sitter profile...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage
                        src={sitter.profileImage || "/placeholder.svg"}
                        alt={`${sitter.firstName} ${sitter.lastName}`}
                      />
                      <AvatarFallback className="text-xl">
                        {sitter.firstName[0]}
                        {sitter.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      {onBookNow && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            onBookNow(sitter.id)
                            onClose()
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                      )}
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">
                        {sitter.firstName} {sitter.lastName}
                      </h1>
                      {sitter.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">{sitter.rating}</span>
                        <span className="text-gray-600">({sitter.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {sitter.location.city}, {sitter.location.state}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {sitter.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-700 mb-4">{sitter.bio}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">{sitter.experienceYears}+</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">₹{sitter.hourlyRate}</div>
                        <div className="text-sm text-gray-600">Per Hour</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{sitter.responseTime}</div>
                        <div className="text-sm text-gray-600">Response Time</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-orange-600">
                          {formatJoinDate(sitter.joinedDate).split(" ")[1]}
                        </div>
                        <div className="text-sm text-gray-600">Member Since</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({sitter.reviewCount})</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Heart className="w-4 h-4 text-red-500" />
                        Services Offered
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {sitter.services.map((service) => (
                          <div key={service} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="capitalize text-sm">{service.replace("-", " ")}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Qualifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Qualifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                          <Shield className="w-3 h-3 text-blue-500" />
                          Safety & Verification
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            {sitter.backgroundCheck ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-gray-300" />
                            )}
                            <span>Background Check</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {sitter.insurance ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-gray-300" />
                            )}
                            <span>Insurance Coverage</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {sitter.petFirstAid ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-gray-300" />
                            )}
                            <span>Pet First Aid Certified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {sitter.emergencyTrained ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-gray-300" />
                            )}
                            <span>Emergency Training</span>
                          </div>
                        </div>
                      </div>

                      {sitter.education.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                            <GraduationCap className="w-3 h-3 text-purple-500" />
                            Education
                          </h4>
                          <div className="space-y-1 text-xs">
                            {sitter.education.map((edu, index) => (
                              <div key={index}>{edu}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sitter.certifications.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-sm">Certifications</h4>
                          <div className="space-y-1 text-xs">
                            {sitter.certifications.map((cert, index) => (
                              <div key={index}>{cert}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Languages */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Globe className="w-4 h-4 text-blue-500" />
                        Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {sitter.languages.map((language) => (
                          <Badge key={language} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Policies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="w-4 h-4 text-orange-500" />
                        Policies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">Response Time</h4>
                        <p className="text-xs text-gray-600">{sitter.responseTime}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Cancellation Policy</h4>
                        <p className="text-xs text-gray-600">{sitter.cancellationPolicy}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Service Radius</h4>
                        <p className="text-xs text-gray-600">{sitter.location.radius} km</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews?.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.reviewerImage || "/placeholder.svg"} alt={review.reviewerName} />
                              <AvatarFallback className="text-xs">{review.reviewerName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{review.reviewerName}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                                <Badge variant="outline" className="text-xs">
                                  {review.serviceType.replace("-", " ")}
                                </Badge>
                                <span>•</span>
                                <span>Pet: {review.petName}</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                              {review.response && (
                                <div className="bg-blue-50 p-2 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-xs">Response from {sitter.firstName}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(review.response.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700">{review.response.message}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <button className="flex items-center gap-1 hover:text-blue-600">
                                  <ThumbsUp className="w-3 h-3" />
                                  Helpful ({review.helpful})
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Camera className="w-4 h-4 text-purple-500" />
                      Photo Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {sitter.gallery.map((image, index) => (
                        <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="w-4 h-4 text-green-500" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Weekly Schedule</h4>
                        <div className="grid grid-cols-7 gap-2 text-center">
                          {Object.entries(sitter.availability).map(([day, available]) => (
                            <div key={day} className="p-2 rounded border">
                              <div className="text-xs font-medium capitalize mb-1">{day.slice(0, 3)}</div>
                              <div
                                className={`w-3 h-3 rounded-full mx-auto ${available ? "bg-green-500" : "bg-gray-300"}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div className="text-center">
                        <p className="text-gray-600 mb-4 text-sm">
                          To check specific date and time availability, please book a service.
                        </p>
                        {onBookNow && (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              onBookNow(sitter.id)
                              onClose()
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Check Availability & Book
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
