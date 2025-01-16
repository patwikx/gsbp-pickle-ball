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
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'access', title: 'Access and Use of the Service' },
  { id: 'account', title: 'User Account' },
  { id: 'membership', title: 'Membership' },
  { id: 'booking', title: 'Court Booking' },
  { id: 'rules', title: 'Court Rules and Etiquette' },
  { id: 'safety', title: 'Safety and Maintenance' },
  { id: 'conduct', title: 'Code of Conduct' },
  { id: 'parking', title: 'Parking Policy' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'disputes', title: 'Governing Law and Disputes' },
  { id: 'contact', title: 'Contact Information' },
];

export default function TermsOfService() {
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
          <span className="text-muted-foreground">Terms of Service</span>
        </nav>

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Terms of Service
          </h1>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <p className="text-sm text-muted-foreground">Last Updated: December 10, 2024</p>
              <p className="mt-4 leading-relaxed">
                Welcome to the General Santos Business Park Pickleball Court booking system. 
                These Terms of Service (&quot;Terms&quot;) govern your use of our website and services. 
                Please read these Terms carefully before using our service.
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
function renderSectionContent(sectionId: string): JSX.Element {
  // ... rest of the renderSectionContent function remains exactly the same ...
  switch (sectionId) {
    case 'acceptance':
      return (
        <p>
          By accessing or using the General Santos Business Park Pickleball Court booking system, 
          you agree to be bound by these Terms of Service. If you disagree with any part of the terms, 
          you may not access the service.
        </p>
      );
    case 'changes':
      return (
        <p>
          We reserve the right to modify or replace these Terms at any time. 
          We will provide notice of any significant changes by posting the new Terms on this page. 
          Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. 
          Please review these Terms periodically for changes.
        </p>
      );
    case 'access':
      return (
        <>
          <p>
            Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use our Service for your personal, non-commercial use.
          </p>
          <p className="mt-4">
            Operating Hours: Open daily from 5:00 AM to 11:00 PM.
          </p>
          <p className="mt-4">
            You agree not to (i) use the Service for any illegal purpose, (ii) interfere with or disrupt the Service or servers or networks connected to the Service, or (iii) violate any applicable laws or regulations.
          </p>
        </>
      );
    case 'account':
      return (
        <>
          <p>
            To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer or device.
          </p>
          <p className="mt-4">
            You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
        </>
      );
    case 'membership':
      return (
        <>
          <p>
            Membership Fee: Php1,000.00 per year
          </p>
          <p className="mt-4">
            Payment Methods: We accept cash payment via GSBPPBC cashier or online payment through fund transfer.
          </p>
          <p className="mt-4">
            Refund Policy: Membership fees are non-refundable and non-transferrable.
          </p>
          <p className="mt-4">
            Access Control: Members will receive membership ID or digital access code upon court entry.
          </p>
        </>
      );
    case 'booking':
      return (
        <>
          <p>
            Court bookings are subject to availability and our booking policies. You agree to provide accurate and complete information when making a booking.
          </p>
          <p className="mt-4">
            Courts can be reserved up to 48 hours in advance through our online booking system (pickleball.rdrealty.com.ph)
          </p>
          <p className="mt-4">
            Playing Duration: Each session is limited to confirmed booking hours.
          </p>
          <p className="mt-4">
            We reserve the right to refuse or cancel any booking at our sole discretion.
          </p>
        </>
      );
    case 'rules':
      return (
        <>
          <p>
            Attire: Non-marking shoes and appropriate sportswear are required.
          </p>
          <p className="mt-4">
            Behavior: All members are expected to demonstrate good sportsmanship and respect towards fellow players and staff. Offensive language or unsportsmanlike conduct will not be tolerated.
          </p>
          <p className="mt-4">
            Equipment: Members are encouraged to bring their own paddles and balls.
          </p>
          <p className="mt-4">
            Cleanup: Please remove personal belongings and trash upon leaving the court.
          </p>
        </>
      );
    case 'safety':
      return (
        <>
          <p>
            Report Damage: Any court damage or maintenance issues must be reported to staff immediately.
          </p>
          <p className="mt-4">
            Injury Policy: Play at your own risk. GSBPPBC is not responsible for any injuries sustained during the activity.
          </p>
        </>
      );
    case 'conduct':
      return (
        <>
          <p>
            Conduct Guidelines: Members must adhere to the rules and show respect for all individuals using the court.
          </p>
          <p className="mt-4">
            Violations: Breaches of the guidelines may result in warnings, temporary suspension, or revocation of membership privileges.
          </p>
          <p className="mt-4">
            You agree to use the courts and facilities in a responsible manner and to follow all posted rules and staff instructions. Any behavior that is disruptive, dangerous, or violates our policies may result in immediate termination of your court use and possible ban from future bookings.
          </p>
          <p className="mt-4">
            You are responsible for any damage you cause to the courts, equipment, or facilities during your use.
          </p>
        </>
      );
    case 'parking':
      return (
        <>
          <p>
            Parking at Your Own Risk: GSBPPBC is not responsible for any loss, theft, or damage to vehicles or their contents while parked on the premises.
          </p>
          <p className="mt-4">
            Parking is permitted for authorized users only.
          </p>
          <p className="mt-4">
            No Overnight Parking: Unauthorized vehicles left overnight are subject to a Php5,000.00 penalty per night unless explicitly authorized in writing by management.
          </p>
        </>
      );
    case 'liability':
      return (
        <>
          <p>
            To the fullest extent permitted by law, General Santos Business Park Pickle Ball Court shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from the Service</li>
            <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service</li>
          </ul>
        </>
      );
    case 'termination':
      return (
        <>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p className="mt-4">
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
          </p>
        </>
      );
    case 'disputes':
      return (
        <>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
          </p>
          <p className="mt-4">
            Any dispute arising from or relating to the subject matter of these Terms shall be finally settled by arbitration in General Santos City, Philippines, using the English language in accordance with the Arbitration Rules and Procedures of the Philippines then in effect, by one commercial arbitrator with substantial experience in resolving intellectual property and commercial contract disputes.
          </p>
        </>
      );
    case 'contact':
      return (
        <>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <address className="mt-4 not-italic">
            General Santos Business Park Pickle Ball Court<br />
            General Santos Business Park, National Highway,<br />
            General Santos City, Philippines<br />
            Email: <a href="mailto:pmd.associate@rdretailgroup.com.ph" className="text-primary hover:underline">pmd.associate@rdretailgroup.com.ph</a><br />
            Phone: +639 99 220 2427
          </address>
        </>
      );
    default:
      return <p>Content for this section is not available.</p>
  }
}