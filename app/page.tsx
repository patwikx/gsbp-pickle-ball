'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Facebook, Twitter, Instagram, ArrowRight, Clock, MapPin, Phone, Mail, Trophy, Coffee } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderFrontPage } from '@/components/front-page-header'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function EnhancedHomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter();

  const features = [
    { 
      title: "State-of-the-art Courts", 
      description: "4 professional-grade courts with premium surfaces for optimal play.",
      icon: <MapPin className="h-8 w-8" />,
      image: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
    },
    { 
      title: "Extended Hours", 
      description: "Fully lit courts for evening games and flexible playing times.",
      icon: <Clock className="h-8 w-8" />,
      image: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
    },
    { 
      title: "Regular Tournaments", 
      description: "Exciting tournaments and leagues for competitive play.",
      icon: <Trophy className="h-8 w-8" />,
      image: "https://utfs.io/f/pUvyWRtocgCVXkOFRZ4SQFwVzqytEldgvRNPo3K4W5XnAihe"
    },
    { 
      title: "Lounge Area", 
      description: "Comfortable space to relax and socialize between games.",
      icon: <Coffee className="h-8 w-8" />,
      image: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
    }
  ]

  const carouselImages = [
    {
      src: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5",
      title: "Christmas Sale! Up to 15% off on new members!", 
      color: "bg-red-500"
    },
    {
      src: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5",
      title: "New Year Special Membership",
      color: "bg-blue-600"
    },
    {
      src: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5",
      title: "Weekend Tournament",
      color: "bg-green-600"
    },
    {
      src: "https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5",
      title: "Summer Camp Registration Open",
      color: "bg-orange-500"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  })


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeaderFrontPage />
      <main className="flex-grow">
        {/* Hero Section with Banner Carousel */}
        <section className="relative w-full h-[500px] overflow-hidden">
          <div className="relative w-full h-full">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                className={`absolute inset-0 w-full h-full ${carouselImages[currentSlide].color} flex items-center justify-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
                  {carouselImages[currentSlide].title}
                </h2>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentSlide === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="relative w-full py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 items-center">
              <div className="flex flex-col space-y-4 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Elevate your game at General Santos Business Park Pickle Ball Court
                </h1>
                <p className="max-w-[700px] text-zinc-500 md:text-xl mx-auto lg:mx-0">
                  Experience the fastest-growing sport in our state-of-the-art facility. Join the pickle ball revolution today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-[#1D4ED8] text-white hover:bg-blue-700"
                  >
                    Book a Court
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-[#1D4ED8] text-[#1D4ED8] hover:bg-blue-50"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-zinc-900">World-Class Facilities</h2>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`transition-all cursor-pointer hover:shadow-lg ${activeFeature === index ? 'border-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <CardContent className="flex items-center p-6">
                        <div className={`mr-4 p-2 rounded-full ${activeFeature === index ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                          <p className="text-zinc-600">{feature.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
                >
                  <Image
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
                    <p>{features[activeFeature].description}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-24 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tighter text-zinc-900">About Pickle Ball</h2>
                <p className="text-xl text-zinc-600">
                  Pickle Ball is a dynamic paddleball sport that combines elements of tennis, badminton, and table tennis. Played on a smaller court with a perforated plastic ball and solid paddles, it&apos;s a game that&apos;s easy to learn but challenging to master. Perfect for players of all ages and skill levels, Pickle Ball offers a unique blend of strategy, agility, and social interaction.
                </p>
                <Button className="w-fit bg-blue-600 text-white hover:bg-blue-700">
                  Discover More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
                  alt="Pickle Ball Court"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-zinc-900">What Our Players Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Alex Johnson", comment: "The courts are top-notch and the staff is incredibly friendly. Best pickle ball experience in GenSan!" },
                { name: "Maria Garcia", comment: "I've improved my game so much thanks to the coaching here. Highly recommend for players of all levels." },
                { name: "David Lee", comment: "The extended hours are fantastic. I can come after work and still get a great game in." }
              ].map((testimonial, index) => (
                <Card key={index} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-zinc-900">{testimonial.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-zinc-600">&quot;{testimonial.comment}&quot;</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Section */}
        <section id="membership" className="w-full py-24 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-zinc-900">Annual Membership</h2>
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
                    "Discounts on pro shop items",
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
                <Button onClick={() => router.push('/auth/sign-up')} className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-6">Become a Member</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-24 
bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter text-center mb-12 text-zinc-900">Get in Touch</h2>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First name</label>
                      <Input id="first-name" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last name</label>
                      <Input id="last-name" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                    <Input id="email" placeholder="Enter your email" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                    <Textarea id="message" placeholder="Enter your message" />
                  </div>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Send Message</Button>
                </form>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Visit Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                        <p className="text-lg">General Santos Business Park, National Highway, Philippines</p>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Clock className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <p className='text-lg'>24/7 Pickleball Court</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Phone className="w-6 h-6 text-blue-600" />
                        <p className="text-lg">+63 999 9999 9999</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <p className="text-lg">info@rdrealty.com.ph</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">About Us</h3>
              <p className="text-zinc-400">General Santos Business Park Pickle Ball Court - your premier destination for pickle ball in GenSan.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="#membership" className="hover:text-blue-400 transition-colors">Membership</Link></li>
                <li><Link href="#contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Newsletter</h3>
              <form className="flex space-x-2">
                <Input type="email" placeholder="Enter your email" className="bg-zinc-800 text-white border-zinc-700" />
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-12 text-center text-zinc-400">
            © 2024 General Santos Business Park Pickle Ball Court. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

