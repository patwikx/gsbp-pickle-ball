"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { Download, Loader2, QrCode } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import QRCode from "react-qr-code";
import { generateUserQR } from "@/actions/queries";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNo: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});

interface ProfileFormProps {
  initialData: {
    name: string;
    contactNo: string;
    address: string;
    image: string;
    email: string;
    qrCode?: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState(initialData.qrCode);
  const qrRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setCurrentQRCode(initialData.qrCode);
  }, [initialData.qrCode]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const response = await updateProfile(session.user.id, values);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Profile updated successfully");
        await updateSession();
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateQR() {
    if (!session?.user?.id) return;

    try {
      setIsGeneratingQR(true);
      const response = await generateUserQR(session.user.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        setCurrentQRCode(response.qrCode);
        toast.success("QR code generated successfully");
        await updateSession({
          ...session,
          user: {
            ...session.user,
            qrCode: response.qrCode
          }
        });
      }
    } finally {
      setIsGeneratingQR(false);
    }
  }

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
      }
      ctx?.fillRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${session?.user?.name || 'user'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={initialData.image || ""} />
            <AvatarFallback>{initialData.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{initialData.name || "Add your name"}</h3>
            <p className="text-sm text-muted-foreground">{initialData.email}</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">QR Code</h3>
            <Button
              onClick={handleGenerateQR}
              disabled={isGeneratingQR || !!currentQRCode}
              variant="outline"
            >
              {isGeneratingQR && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <QrCode className="mr-2 h-4 w-4" />
              {currentQRCode ? "QR Code Generated" : "Generate QR Code"}
            </Button>
          </div>
          
          {currentQRCode && (
            <div className="flex flex-col items-center space-y-2">
              <div ref={qrRef}>
                <QRCode 
                  value={currentQRCode}
                  size={200}
                  level="H"
                  style={{ 
                    height: "auto", 
                    maxWidth: "100%", 
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0"
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  QR Code ID: {currentQRCode}
                </p>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
              </div>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormDescription>
                    Your contact number will be used for booking notifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Your address will be used for billing purposes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}