import Link from 'next/link'
import { HardHat, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <HardHat className="mx-auto h-24 w-24 text-yellow-500 mb-8" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Under Construction</h1>
        <p className="text-xl text-gray-600 mb-8">
          We&apos;re working hard to bring you an amazing settings management experience.
          Please check back soon!
        </p>
        <Link href="/dashboard" passHref>
          <Button variant="outline" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

