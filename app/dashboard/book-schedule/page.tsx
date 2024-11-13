import CourtLayout from "@/components/court-layout";



export default function BookPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <CourtLayout />
        </div>
      </div>
    </main>
  )
}