'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Menu, X, Check, Star, Facebook, Twitter, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/rdrdc.webp" alt="Logo" width={32} height={32} />
            <span className="font-bold text-xl">GenSan Pickle Ball</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link href="#booking" className="text-sm font-medium hover:text-primary transition-colors">Book a Court</Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          </nav>
          <Button onClick={() => router.push('/auth/sign-in')} className="hidden md:inline-flex">Login</Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
              <span className="font-bold text-xl">GenSan Pickle Ball</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="grid gap-6 p-6">
            <Link href="#features" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>Features</Link>
            <Link href="#about" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>About</Link>
            <Link href="#booking" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>Book a Court</Link>
            <Link href="#pricing" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>Pricing</Link>
            <Link href="#contact" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>Contact</Link>
            <Button className="w-full" size="lg">Sign Up</Button>
          </nav>
        </div>
      )}
      <main className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Welcome to General Santos Business Park Pickle Ball Court
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-200 md:text-xl">
                  Experience the fastest-growing sport in a state-of-the-art facility. Book your court today and join the pickle ball revolution!
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-primary hover:bg-zinc-200">Book Now</Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "State-of-the-art Courts", description: "6 professional-grade courts with premium surfaces for optimal play." },
                { title: "Night Play", description: "Fully lit courts for evening games and extended hours." },
                { title: "Pro Shop", description: "Fully stocked with the latest pickle ball gear and equipment." },
                { title: "Coaching", description: "Expert instruction available for players of all levels." },
                { title: "Tournaments", description: "Regular tournaments and leagues for competitive play." },
                { title: "Lounge Area", description: "Comfortable space to relax and socialize between games." }
              ].map((feature, index) => (
                <Card key={index} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Pickle Ball</h2>
                <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Pickle Ball is a paddleball sport that combines elements of tennis, badminton, and table tennis. It&apos;s played on a smaller court with a perforated plastic ball and solid paddles. Easy to learn but challenging to master, it&apos;s perfect for players of all ages and skill levels.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg"
                  alt="Pickle Ball Court"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="booking" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Book a Court</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div>
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="calendar">
                    <Card>
                      <CardHeader>
                        <CardTitle>Select a Date</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="list">
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Time Slots</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"].map((time, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border rounded hover:bg-zinc-100 transition-colors">
                              <span>{time}</span>
                              <Button size="sm">Book</Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Selected Date: {date?.toDateString()}</p>
                    <p>Selected Time: Not selected</p>
                    <p>Court: Not selected</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Confirm Booking</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Players Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Alex Johnson", comment: "The courts are top-notch and the staff is incredibly friendly. Best pickle ball experience in GenSan!" },
                { name: "Maria Garcia", comment: "I've improved my game so much thanks to the coaching here. Highly recommend for players of all levels." },
                { name: "David Lee", comment: "The night play option is fantastic. I can come after work and still get a great game in." }
              ].map((testimonial, index) => (
                <Card key={index} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{testimonial.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic">&quot;{testimonial.comment}&quot;</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Membership Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Basic", price: "$50/month", features: ["Unlimited court access", "Basic equipment rental", "Access to open play sessions"] },
                { name: "Pro", price: "$100/month", features: ["Everything in Basic", "4 coaching sessions/month", "Priority court booking", "Pro shop discounts"] },
                { name: "Elite", price: "$200/month", features: ["Everything in Pro", "Unlimited coaching", "Exclusive tournament entry", "Personal locker"] }
              ].map((plan, index) => (
                <Card key={index} className={`transition-all hover:shadow-lg ${index === 1 ? "border-primary" : ""}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-3xl font-bold">{plan.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="w-5 h-5 mr-2 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Choose Plan</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Contact Us</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  <Button className="w-full">Send Message</Button>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Visit Us</h3>
                <p>123 Business Park Avenue, General Santos City, Philippines</p>
                <h3 className="text-2xl font-bold">Opening Hours</h3>
                <p>Monday - Friday: 7:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 8:00 AM - 9:00 PM</p>
                <h3 className="text-2xl font-bold">Contact Information</h3>
                <p>Phone: +63 123 456 7890</p>
                <p>Email: info@gensanpickleball.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">About Us</h3>
              <p className="text-sm text-zinc-400">General Santos Business Park Pickle Ball Court - your premier destination for pickle ball in GenSan.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#booking" className="hover:text-primary transition-colors">Book a Court</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Newsletter</h3>
              <form className="flex space-x-2">
                <Input type="email" placeholder="Enter your email" className="bg-zinc-800 text-white border-zinc-700" />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-zinc-400">
            © 2024 General Santos Business Park Pickle Ball Court. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}