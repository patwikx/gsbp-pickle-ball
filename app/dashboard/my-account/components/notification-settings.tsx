"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function NotificationSettings() {
  return (
    <>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="booking-notifications">Booking Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your court bookings.
              </p>
            </div>
            <Switch id="booking-notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder-notifications">Booking Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded about your upcoming bookings.
              </p>
            </div>
            <Switch id="reminder-notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-notifications">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions.
              </p>
            </div>
            <Switch id="marketing-notifications" />
          </div>
        </div>
      </CardContent>
    </>
  );
}