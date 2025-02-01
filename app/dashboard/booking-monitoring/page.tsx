import { Suspense } from "react";
import { BookingsHeader } from "./components/booking-header";
import { getBookings } from "@/actions/monitoring";
import { BookingTableSkeleton } from "./components/monitoring-loading";
import { BookingsDataTable } from "./components/monitoring-data-table";

export default async function BookingsPage() {
  let bookings = await getBookings();
  bookings = bookings.map(booking => ({
    ...booking,
    user: {
      ...booking.user,
      name: booking.user.name ?? "",
      email: booking.user.email ?? ""
    },
    invitedPlayers: booking.invitedPlayers.map(player => ({
      ...player,
      name: player.name ?? ""
    }))
  }));

  return (
    <div className="container mx-auto py-6 space-y-4">
      <BookingsHeader />
      
      <Suspense fallback={<BookingTableSkeleton />}>
        <BookingsDataTable data={bookings} />
      </Suspense>
    </div>
  );
}