import UserBookings from "@/components/user-bookings";



export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <UserBookings />
    </div>
  )
}