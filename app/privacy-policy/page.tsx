'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderFrontPage } from '@/components/front-page-header'
import { ChevronUp, Home } from 'lucide-react'
import { Footer } from '@/components/footer'

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-your-information', title: 'How We Use Your Information' },
  { id: 'disclosure-of-your-information', title: 'Disclosure of Your Information' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'your-privacy-rights', title: 'Your Privacy Rights' },
  { id: 'childrens-privacy', title: "Children's Privacy" },
  { id: 'updates-to-this-privacy-policy', title: 'Updates to this Privacy Policy' },
  { id: 'contact-us', title: 'Contact Us' },
]

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      setScrollProgress((scrollPosition / (fullHeight - windowHeight)) * 100)

      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      )

      const currentSection = sectionElements.findIndex(el => 
        el && el.offsetTop <= scrollPosition + 200
      )

      if (currentSection !== -1) {
        setActiveSection(sections[currentSection].id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <HeaderFrontPage />

      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm mb-8 flex items-center space-x-2">
          <Link href="/" className="text-primary hover:underline flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-muted-foreground">Privacy Policy</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Effective Date: December 10, 2024</p>
            <p className="mt-4">
              RD REALTY DEVELOPMENT CORPORATION is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our pickleball booking system.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 h-fit sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <Link 
                        href={`#${section.id}`} 
                        className={`block p-2 rounded-md transition-colors ${
                          activeSection === section.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-2xl font-semibold mb-4">
                  {section.title}
                </h2>
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    {renderSectionContent(section.id)}
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      <Footer />

      <Button
        className="fixed bottom-4 right-4 rounded-full p-2"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
    </div>
  )
}

function renderSectionContent(sectionId: string) {
  switch (sectionId) {
    case 'introduction':
      return (
        <p>
          RD REALTY DEVELOPMENT CORPORATION is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our pickleball court booking system.
        </p>
      )
    case 'information-we-collect':
      return (
        <>
          <p>We may collect the following types of information when you use the System:</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact information: Your name, email address, phone number, and address.</li>
            <li>Account information: Username, password, and other information you provide to create an account.</li>
            <li>Booking information: Details about your pickleball court bookings, including date, time, location, and players involved.</li>
            <li>Communication preferences: Your preferences for receiving communications from us, such as email newsletters or promotional offers.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">Non-Personal Information:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information: Your IP address, browser type, operating system, and device identifiers.</li>
            <li>Usage data: Information about how you use the System, such as the pages you visit, the features you use, and the time and date of your activities.</li>
            <li>Aggregated data: De-identified or anonymized data that is compiled from multiple users and cannot be linked back to any individual.</li>
          </ul>
        </>
      )
    case 'how-we-use-your-information':
      return (
        <>
          <p>We may use your information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To provide and improve the System: To process your bookings, manage your account, and enhance your user experience.</li>
            <li>To communicate with you: To send you booking confirmations, reminders, updates, and other important information about the System.</li>
            <li>To personalize your experience: To tailor the content and features of the System to your preferences.</li>
            <li>To send you marketing communications: To provide you with information about new offerings, promotions, and other updates, but only if you have opted in to receive such communications.</li>
            <li>To analyze and improve our services: To understand how users interact with the System and identify areas for improvement.</li>
            <li>To protect our rights and interests: To prevent fraud, enforce our Terms of Service, and comply with applicable laws and regulations.</li>
          </ul>
        </>
      )
    case 'disclosure-of-your-information':
      return (
        <>
          <p>We may disclose your information to the following third parties:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Service providers: We may share your information with third-party service providers who assist us in operating the System, such as payment processors, email marketing platforms, and data analytics providers. These providers are contractually obligated to protect your information.</li>
            <li>Business partners: We may share your information with business partners who offer products or services that may be of interest to you, but only if you have opted in to receive such communications.</li>
            <li>Legal authorities: We may disclose your information to legal authorities if required to do so by law or in the good faith belief that such disclosure is necessary to comply with a legal obligation, protect and defend our rights or property, prevent or investigate possible wrongdoing, or protect the personal safety of users of the System or the public.</li>
          </ul>
        </>
      )
    case 'data-security':
      return (
        <>
          <p>We take reasonable measures to protect your information from unauthorized access, use, or disclosure. These measures include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Data encryption: We use industry-standard encryption technologies to protect your data during transmission and storage.</li>
            <li>Access controls: We restrict access to your information to authorized personnel only.</li>
            <li>Security assessments: We regularly conduct security assessments to identify and address potential vulnerabilities.</li>
          </ul>
        </>
      )
    case 'your-privacy-rights':
      return (
        <>
          <p>You have the following rights with respect to your personal information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Right to access: You can request access to your personal information that we hold.</li>
            <li>Right to rectification: You can request that we correct any inaccuracies in your personal information.</li>
            <li>Right to erasure: You can request that we delete your personal information, subject to certain exceptions.</li>
            <li>Right to restriction of processing: You can request that we restrict the processing of your personal information in certain circumstances.</li>
            <li>Right to data portability: You can request that we provide you with a copy of your personal information in a structured, commonly used, and machine-readable format.</li>
            <li>Right to object: You can object to the processing of your personal information in certain circumstances.</li>
          </ul>
          <p className="mt-4">To exercise any of these rights, please contact us using the contact information provided below.</p>
        </>
      )
    case 'childrens-privacy':
      return (
        <p>The System is not intended for children under the age of 17. We do not knowingly collect personal information from children under this age. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.</p>
      )
    case 'updates-to-this-privacy-policy':
      return (
        <p>We may update this Privacy Policy from time to time. We will post any changes on the System and notify you as required by law.</p>
      )
    case 'contact-us':
      return (
        <>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <address className="mt-4 not-italic">
            RD REALTY DEVELOPMENT CORPORATION<br />
            General Santos Business Park, National Highway, General Santos City, Philippines<br />
            Email: <a href="mailto:info@rdrealty.com.ph" className="text-primary hover:underline">info@rdrealty.com.ph</a><br />
            Phone: +639 99 220 2427
          </address>
        </>
      )
    default:
      return <p>Content for this section is not available.</p>
  }
}

