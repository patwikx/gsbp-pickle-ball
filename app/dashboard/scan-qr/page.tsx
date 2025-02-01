"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { QrScanner } from "./components/qr-scanner";
export default function ScanPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            Scan member QR codes to log their attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
              <QrScanner />
        </CardContent>
      </Card>
    </div>
  );
}