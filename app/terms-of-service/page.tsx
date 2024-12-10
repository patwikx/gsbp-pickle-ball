'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderFrontPage } from '@/components/front-page-header'
import { ChevronUp, Home } from 'lucide-react'
import { Footer } from '@/components/footer'

// Interface for defining the structure of each section
interface Section {
  id: string;
  title: string;
}

// Array of sections with their corresponding IDs and titles
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
  { id: 'cancellation', title: 'Cancellation and Refund Policy' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'disputes', title: 'Governing Law and Disputes' },
  { id: 'contact', title: 'Contact Information' },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      setScrollProgress((scrollPosition / (fullHeight - windowHeight)) * 100);

      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      );

      const currentSection = sectionElements.findIndex(el => 
        el && el.offsetTop <= scrollPosition + 200 
      );

      if (currentSection !== -1) {
        setActiveSection(sections[currentSection].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <span className="text-muted-foreground">Terms of Service</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Last Updated: December 10, 2024</p>
            <p className="mt-4">
              Welcome to the General Santos Business Park Pickle Ball Court booking system. 
              These Terms of Service (&quot;Terms&quot;) govern your use of our website and services. 
              Please read these Terms carefully before using our service.
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
  );
}

// Function to render content for each section based on sectionId
function renderSectionContent(sectionId: string): JSX.Element {
  switch (sectionId) {
    case 'acceptance':
      return (
        <p>
          By accessing or using the General Santos Business Park Pickle Ball Court booking system, 
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
            Payment Methods: We accept cash payment via GSBPPBC cashier.
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
            We reserve the right to refuse or cancel any booking at our sole discretion. In such cases, we will provide a full refund of any fees paid.
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
    case 'cancellation':
      return (
        <>
          <p>
            Cancellations made at least 24 hours before the scheduled court time will receive a full refund. Cancellations made less than 24 hours before the scheduled court time are not eligible for a refund.
          </p>
          <p className="mt-4">
            In case of inclement weather or unforeseen circumstances that render the courts unusable, we will offer a full refund or the option to reschedule your booking.
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

