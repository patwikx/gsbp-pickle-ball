'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { UserCircle, Shield, Bell } from "lucide-react";
import { ProfileForm } from "./profile-form";
import { SecurityForm } from "./security-form";
import { NotificationSettings } from "./notification-settings";

// The ProfileTabsProps interface should now expect user as well.
interface ProfileTabsProps {
  initialData: {
    name: string;
    contactNo: string;
    address: string;
    image: string;
    email: string;
    qrCode: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
    qrCode: string | null;
  };
}

export function ProfileTabs({ initialData }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:max-w-[400px]">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <ProfileForm initialData={initialData} />
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <SecurityForm email={initialData.email} />
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <NotificationSettings />
        </Card>
      </TabsContent>
    </Tabs>
  );
}