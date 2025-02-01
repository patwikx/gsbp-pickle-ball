import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { ProfileTabs } from "./components/profile-tabs";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await prismadb.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />
        {/* Pass both initialData and user */}
        <ProfileTabs 
          initialData={{
            name: user.name || "",
            contactNo: user.contactNo || "",
            address: user.address || "",
            image: user.image || "",
            email: user.email || "",
            qrCode: user.qrCode || "",
          }}
          user={user}
        />
      </div>
    </div>
  );
}