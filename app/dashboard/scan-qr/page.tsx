"use client";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { QrScanner } from "./components/qr-scanner";
import { ScanHistory } from "./components/scan-history";

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
          <Tabs defaultValue="scan" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">Scan QR</TabsTrigger>
              <TabsTrigger value="history">Scan History</TabsTrigger>
            </TabsList>
            <TabsContent value="scan" className="space-y-4">
              <QrScanner />
            </TabsContent>
            <TabsContent value="history">
              <ScanHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}