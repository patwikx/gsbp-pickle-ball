"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AdPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(false)

  useEffect(() => {
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasBeenShown(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [hasBeenShown])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open("https://www.facebook.com/RDRealtyGensan", "_blank", "noopener,noreferrer")
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:max-w-md md:left-8 md:right-auto"
        >
          <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div
              onClick={handleClick}
              className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCV8qjFnTwbQWfZ8qR7tlALo4shKJmruxVyOwcp"
                  alt="Advertisement"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

