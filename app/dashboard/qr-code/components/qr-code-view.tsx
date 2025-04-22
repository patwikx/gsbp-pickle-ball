'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Download, RefreshCw } from "lucide-react";
import QRCode from "react-qr-code";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { generateUserQR } from "@/actions/queries";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  qrCode: string | null;
}

interface QRCodeViewProps {
  user: User;
}

export function QRCodeView({ user }: QRCodeViewProps) {
  const { update: updateSession } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState(user.qrCode);

  async function handleGenerateQR() {
    try {
      setIsGenerating(true);
      const response = await generateUserQR(user.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        setCurrentQRCode(response.qrCode ?? null);
        toast.success("QR code generated successfully");
        await updateSession({
          user: {
            ...user,
            qrCode: response.qrCode,
          },
        });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownloadQR() {
    if (!currentQRCode) return;

    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${user.name || "user"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full max-w-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Your QR Code</h1>
            <p className="text-muted-foreground mt-2">
              Use this QR code for quick access and identification
            </p>
          </div>
          <Button
            onClick={handleGenerateQR}
            disabled={isGenerating}
            variant={currentQRCode ? "outline" : "default"}
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {currentQRCode ? "Regenerate QR Code" : "Generate QR Code"}
          </Button>
        </div>

        <Card className="p-8">
          {currentQRCode ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <QRCode
                    id="qr-code"
                    value={currentQRCode}
                    size={300}
                    level="H"
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <Button
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium mb-2">QR Code Details</h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">User</dt>
                    <dd className="text-sm font-medium">{user.name || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="text-sm font-medium">{user.email || "N/A"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-muted-foreground">QR Code ID</dt>
                    <dd className="text-sm font-medium font-mono">{currentQRCode}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <QrCode className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No QR Code Generated</h3>
              <p className="text-muted-foreground mt-2">
                Generate a QR code to get started
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
