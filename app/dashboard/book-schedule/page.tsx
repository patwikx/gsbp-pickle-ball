import CourtLayout from "@/app/dashboard/book-schedule/components/court-layout";
import { getCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";



export default async function BookPage() {
  const session = await getCurrentUser();
  if (!session){
    redirect('/auth/sign-in')
  }
 
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