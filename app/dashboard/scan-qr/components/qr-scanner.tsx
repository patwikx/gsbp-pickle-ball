"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logQRScan } from "@/actions/qr-scan";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function QrScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    // Request camera permission when component mounts
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          setCameraError(null);
        })
        .catch((error) => {
          console.error("Camera permission error:", error);
          setCameraError("Camera access denied. Please grant permission to use your camera.");
        });
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          videoConstraints: {
            facingMode: { ideal: "environment" }
          }
        },
        false
      );

      qrScanner.render(onScanSuccess, onScanError);
      setScanner(qrScanner);
      setIsScanning(true);
      setScanResult(null);
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Please allow camera access to scan QR codes. If denied, please check your browser settings.");
      toast.error("Camera access denied. Please check your browser settings.");
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      stopScanning();
      setScanResult(decodedText);
      
      const result = await logQRScan({
        qrCode: decodedText,
        device: navigator.userAgent,
        location: "Main Entrance",
      });

      if (result.error) {
        if (result.isDuplicate) {
          toast.error("This QR code has already been scanned today");
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success("QR code scanned successfully");
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Failed to process QR code");
    }
  };

  const onScanError = (errorMessage: string) => {
    // Only log critical errors
    if (errorMessage !== "NotFoundException") {
      console.warn("QR Scan Error:", errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {!isScanning && !scanResult && (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-center">
            Click the button below to start scanning QR codes using your camera
          </p>
          <Button onClick={startScanning}>Start Scanning</Button>
        </div>
      )}

      {cameraError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            {cameraError}
            <p className="mt-2 text-sm">
              If you previously denied access, you&apos;ll need to reset permissions in your browser settings.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div id="qr-reader" className="w-full max-w-sm mx-auto" />

      {isScanning && (
        <div className="flex justify-center mt-4">
          <Button variant="destructive" onClick={stopScanning}>
            Stop Scanning
          </Button>
        </div>
      )}
    </div>
  );
}