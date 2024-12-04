'use client'

import * as React from 'react'

export function BookingHeader() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary/70 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold">
        GSBP Pickle Ball Court Booking
      </h1>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  )
}