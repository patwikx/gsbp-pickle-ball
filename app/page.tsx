'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Users, Trophy, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MainNav } from '@/components/front-page-header'
import { Footer } from '@/components/footer'
import { useRouter } from 'next/navigation'

const features = [
  {
    title: "Book Courts",
    description: "Reserve your court time easily through our online booking system",
    icon: Calendar,
    color: "bg-blue-500"
  },
  {
    title: "Join Community",
    description: "Connect with fellow players and join our growing pickleball community",
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Tournaments",
    description: "Participate in regular tournaments for all skill levels",
    icon: Trophy,
    color: "bg-purple-500"
  },
  {
    title: "Premium Facilities",
    description: "Experience world-class courts and amenities",
    icon: Star,
    color: "bg-orange-500"
  }
]

const funFacts = [
  {
    title: "Origin Story",
    fact: "Pickleball was invented in 1965 on Bainbridge Island, Washington, by three dads looking to entertain their bored children.",
    icon: "🏓",
    color: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    title: "Name Origin",
    fact: "The game was named after the Pritchards' family dog, Pickles, who would chase after stray balls.",
    icon: "🐕",
    color: "bg-gradient-to-br from-green-500 to-teal-600"
  },
  {
    title: "Fastest Growing Sport",
    fact: "Pickleball is currently the fastest-growing sport in America, with a 39.3% growth rate between 2019 and 2021.",
    icon: "📈",
    color: "bg-gradient-to-br from-orange-500 to-red-600"
  },
  {
    title: "Universal Appeal",
    fact: "Players aged 6 to 85+ enjoy pickleball, making it one of the most accessible sports for all ages and skill levels.",
    icon: "🌟",
    color: "bg-gradient-to-br from-pink-500 to-rose-600"
  }
]

const propertyImages = [
  {
    url: "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVrQ152PpuOasyUGgBmjXo3zxvSV4LElJHIM58",
    title: "General Santos Business Park",
    description: "Commercial Spaces prime for your businesses",
    features: ["Parking", "24/7 Security equipped with CCTV Cameras", "In the heart of General Santos City"]
  },
  {
    url: "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVSFS1kKPxQ8AsDOWnbNTajmwkgGJrKeCXdIfB",
    title: "General Santos Business Park",
    description: "Commercial Spaces prime for your businesses",
    features: ["Parking", "24/7 Security equipped with CCTV Cameras", "In the heart of General Santos City"]
  },
  {
    url: "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVhVBTeBL6dURkCuz3sloM2OqFTWgGJyQ01485",
    title: "General Santos Business Park",
    description: "Commercial Spaces prime for your businesses",
    features: ["Parking", "24/7 Security equipped with CCTV Cameras", "In the heart of General Santos City"]
  }
]

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 6.1205169,
  lng: 125.1841202
}

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [propertyIndex, setPropertyIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  const images = [
    "https://utfs.io/f/79b3aedf-1d04-4a29-bb08-f21736a645f8-1w7cq.webp",
    "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVrQ152PpuOasyUGgBmjXo3zxvSV4LElJHIM58",
    "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVSFS1kKPxQ8AsDOWnbNTajmwkgGJrKeCXdIfB",
    "https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVhVBTeBL6dURkCuz3sloM2OqFTWgGJyQ01485"
  ]

  const mapOptions = useMemo((): google.maps.MapOptions => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true
  }), [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true)
      setNextImageIndex((currentImageIndex + 1) % images.length)
      
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex)
        setIsTransitioning(false)
      }, 1000)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [currentImageIndex, nextImageIndex, images.length])

  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      if (isAutoPlaying) {
        setPropertyIndex((prev) => (prev + 1) % propertyImages.length)
      }
    }, 5000)

    return () => clearInterval(autoPlayInterval)
  }, [isAutoPlaying])

  const nextProperty = () => {
    setIsAutoPlaying(false)
    setPropertyIndex((prev) => (prev + 1) % propertyImages.length)
  }

  const prevProperty = () => {
    setIsAutoPlaying(false)
    setPropertyIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)
  }

  const router = useRouter()

  return (
    
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative h-full">
            <motion.div 
              className="absolute inset-0"
              animate={{ scale: 1.05 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            >
              <Image
                src={images[currentImageIndex]}
                alt="Pickleball Court"
                fill
                className="object-cover transition-opacity duration-1000"
                priority
              />
            </motion.div>
            <motion.div 
              className="absolute inset-0"
              animate={{ scale: 1.05 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            >
              <Image
                src={images[nextImageIndex]}
                alt="Pickleball Court"
                fill
                className={`object-cover transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
                priority
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
          </div>
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-2xl space-y-6">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Experience the Thrill of Pickleball
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join the fastest-growing sport at General Santos Business Park&apos;s premier pickleball facility
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                onClick={() => router.push('/auth/sign-up')}
              >
                Register now!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 text-white transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Fun Facts About Pickleball</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
                  <div className={`${fact.color} p-1`}>
                    <CardContent className="p-6 bg-white rounded-t-lg">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{fact.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {fact.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">{fact.fact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Advertisement Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Premium Facilities</h2>
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={propertyIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src={propertyImages[propertyIndex].url}
                alt={propertyImages[propertyIndex].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {propertyImages[propertyIndex].title}
                </h3>
                <p className="text-xl text-gray-200 mb-4">
                  {propertyImages[propertyIndex].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {propertyImages[propertyIndex].features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                onClick={prevProperty}
                className="pointer-events-auto transform hover:scale-110 transition-all duration-300 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg text-gray-800"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextProperty}
                className="pointer-events-auto transform hover:scale-110 transition-all duration-300 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg text-gray-800"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Membership Plan</h2>
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Premium Membership</h3>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₱1,000
                      <span className="text-lg text-gray-600">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "24/7 court access",
                      "Priority booking system",
                      "Free equipment rental",
                      "Access to all facilities",
                      "Tournament entry discounts",
                      "Guest passes (2/month)",
                      "Exclusive member events"
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-gray-600"
                      >
                        <Star className="w-5 h-5 text-blue-600 mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300" 
                    size="lg"
                  >
                    Become a Member
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Find Us</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={18}
                options={mapOptions}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Playing?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of pickleball enthusiasts and experience the best courts in General Santos City
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              asChild
              className="transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/auth/sign-up">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}