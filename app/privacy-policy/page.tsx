'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronUp, Home, Menu } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { MainNav } from '@/components/front-page-header'

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
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      setScrollProgress((scrollPosition / (fullHeight - windowHeight)) * 100);
      setShowScrollTop(scrollPosition > windowHeight * 0.5);

      // Improved section detection with Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -80% 0px',
        }
      );

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sheet close and perform scroll
  useEffect(() => {
    if (!sheetOpen && pendingScroll) {
      const element = document.getElementById(pendingScroll);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          setPendingScroll(null);
        }, 150);
      }
    }
  }, [sheetOpen, pendingScroll]);

  const scrollToSection = (sectionId: string) => {
    setPendingScroll(sectionId);
    setSheetOpen(false);
  };

  const TableOfContents = () => (
    <nav className="space-y-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200",
            "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
            activeSection === section.id
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {section.title}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <MainNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8 flex items-center space-x-2 animate-fade-in">
          <Link 
            href="/" 
            className="text-primary hover:text-primary/80 transition-colors flex items-center group"
          >
            <Home className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Privacy Policy</span>
        </nav>

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Privacy Policy
          </h1>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <p className="text-sm text-muted-foreground">Effective Date: December 10, 2024</p>
              <p className="mt-4 leading-relaxed">
                RD REALTY DEVELOPMENT CORPORATION is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our pickleball booking system.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Table of Contents */}
        <div className="lg:hidden mb-8">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>Table of Contents</span>
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
                <TableOfContents />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Table of Contents */}
          <Card className="hidden lg:block h-fit sticky top-20 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
              <TableOfContents />
            </CardContent>
          </Card>

          {/* Content Sections */}
          <div className="lg:col-span-3 space-y-12">
            {sections.map((section) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                  <span>{section.title}</span>
                </h2>
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <CardContent className="p-8">
                    {renderSectionContent(section.id)}
                  </CardContent>
                </Card>
              </motion.section>
            ))}
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="animate-fade-in">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl p-3"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Function to render content for each section based on sectionId
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