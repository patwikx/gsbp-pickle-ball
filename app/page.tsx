'use client'

import { useState,  useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { ArrowRight, Check, Clock, MapPin, Phone, Mail, Trophy, Coffee } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HeaderFrontPage } from '@/components/front-page-header'
import { Footer } from '@/components/footer'
import { HeroCarousel } from '@/components/hero-carousel'
import { FeatureCard } from '@/components/feature-card'
import { TestimonialCarousel } from '@/components/testimonial-card'
import { ContactForm } from '@/components/contact-form'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 6.1205169,
  lng: 125.1841202
}

const features = [
  { 
    title: "State-of-the-art Courts", 
    description: "4 professional-grade courts with premium surfaces for optimal play.",
    icon: <MapPin className="h-8 w-8" />,
    image: "https://utfs.io/f/b12eb9a2-0f34-4e7d-936b-036b47d2e49b-235u.webp"
  },
  { 
    title: "Extended Hours", 
    description: "Fully lit courts for evening games and flexible playing times.",
    icon: <Clock className="h-8 w-8" />,
    image: "https://utfs.io/f/a31312a4-ac64-4212-9b8e-1ffb880a0e76-hep9t5.webp"
  },
  { 
    title: "Regular Tournaments", 
    description: "Exciting tournaments and leagues for competitive play.",
    icon: <Trophy className="h-8 w-8" />,
    image: "https://utfs.io/f/d918ff1c-e346-4b8b-8046-aeb203019ba1-fh699f.webp"
  },
  { 
    title: "Lounge Area", 
    description: "Comfortable space to relax and socialize between games.",
    icon: <Coffee className="h-8 w-8" />,
    image: "https://utfs.io/f/79b3aedf-1d04-4a29-bb08-f21736a645f8-1w7cq.webp"
  }
]

const carouselImages = [
  {
    src: "https://utfs.io/f/79b3aedf-1d04-4a29-bb08-f21736a645f8-1w7cq.webp",
    title: "Christmas Sale! Up to 15% off on new members!", 
    color: "bg-gradient-to-r from-red-600 to-red-400"
  },
  {
    src: "https://utfs.io/f/d918ff1c-e346-4b8b-8046-aeb203019ba1-fh699f.webp",
    title: "New Year Special Membership",
    color: "bg-gradient-to-r from-blue-600 to-blue-400"
  },
  {
    src: "https://utfs.io/f/a31312a4-ac64-4212-9b8e-1ffb880a0e76-hep9t5.webp",
    title: "Weekend Tournament",
    color: "bg-gradient-to-r from-green-600 to-green-400"
  },
  {
    src: "https://utfs.io/f/b12eb9a2-0f34-4e7d-936b-036b47d2e49b-235u.webp",
    title: "Summer Camp Registration Open",
    color: "bg-gradient-to-r from-orange-600 to-orange-400"
  }
]

const testimonials = [
  { name: "Ceazar R.", comment: "The courts are top-notch and the staff is incredibly friendly. Best pickle ball experience in GenSan!" },
  { name: "Larry P.", comment: "I've improved my game so much thanks to the coaching here. Highly recommend for players of all levels." },
  { name: "Kristian Q.", comment: "The extended hours are fantastic. I can come after work and still get a great game in." },
  { name: "Maria S.", comment: "The community here is amazing. I've made so many new friends through pickle ball at this facility." },
  { name: "David L.", comment: "State-of-the-art courts and equipment. It's a pleasure to play here every time." }
]

export default function EnhancedHomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()

  const mapOptions = useMemo((): google.maps.MapOptions => ({
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite']
    }
  }), [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderFrontPage />
      <main className="flex-grow">
        <HeroCarousel images={carouselImages} />

        <section className="relative w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 items-center lg:grid-cols-2">
              <div className="flex flex-col space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Elevate Your Game at General Santos Business Park Pickle Ball Court
                </h1>
                <p className="max-w-[700px] text-gray-600 md:text-xl">
                  Experience the fastest-growing sport in our state-of-the-art facility. Join the pickle ball revolution today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                  >
                    Book a Court
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={19}
                    options={mapOptions}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-gray-900">World-Class Facilities</h2>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    feature={feature}
                    isActive={activeFeature === index}
                    onClick={() => setActiveFeature(index)}
                  />
                ))}
              </div>
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
                >
                  <Image
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-3">{features[activeFeature].title}</h3>
                    <p className="text-lg">{features[activeFeature].description}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-4xl font-bold tracking-tighter text-gray-900">About Pickle Ball</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Pickle Ball is a dynamic paddleball sport that combines elements of tennis, badminton, and table tennis. Played on a smaller court with a perforated plastic ball and solid paddles, it&apos;s a game that&apos;s easy to learn but challenging to master. Perfect for players of all ages and skill levels, Pickle Ball offers a unique blend of strategy, agility, and social interaction.
                </p>
                <Button className="w-fit bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                  Discover More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/images/about-pickleball.jpg"
                  alt="Pickle Ball Court"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-gray-900">What Our Players Say</h2>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        <section id="membership" className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-gray-900">Annual Membership</h2>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Premium Membership</CardTitle>
                <CardDescription className="text-4xl font-bold text-center text-blue-600">₱1,000 / year</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-lg">
                  {[
                    "Unlimited court access",
                    "Priority booking",
                    "Access to all facilities",
                    "Participation in members-only events",
                    "Free guest passes (2 per year)"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-6 h-6 mr-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.push('/auth/sign-up')} className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-6 transition-colors duration-300">Become a Member</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section id="contact" className="w-full py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-gray-900">Get in Touch</h2>
            <div className="grid gap-12 lg:grid-cols-2">
              <ContactForm />
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Visit Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                        <p className="text-lg">General Santos Business Park, National Highway, General Santos City, Philippines</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Phone className="w-6 h-6 text-blue-600" />
                        <p className="text-lg">+639 99 220 2427</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <p className="text-lg">pmd.associate@rdretailgroup.com.ph</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
