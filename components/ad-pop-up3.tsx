'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AdPopup3() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(false)

  useEffect(() => {
    // Show the popup after 2 seconds, but only once per session
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasBeenShown(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasBeenShown])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 max-w-md w-full"
        >
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <a 
              href="https://www.facebook.com/RDRealtyGensan/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVjN8KsSJ2aSpFg1cK04bxM5IZTu7s6YJGtEdr"
                  alt="Advertisement"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}