"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logQRScan } from "@/actions/qr-scan";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function QrScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDuplicateScan, setIsDuplicateScan] = useState(false);

  useEffect(() => {
    // Request camera permission when component mounts
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
        try {
          scanner.clear();
        } catch (error) {
          console.error("Error clearing scanner:", error);
        }
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      setIsDuplicateScan(false);
      
      // Create scanner with safe configuration
      const config = {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        config,
        /* verbose= */ false
      );

      qrScanner.render(onScanSuccess, onScanError);
      setScanner(qrScanner);
      setIsScanning(true);
      setScanResult(null);
      setShowSuccess(false);
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Please allow camera access to scan QR codes. If denied, please check your browser settings.");
      toast.error("Camera access denied. Please check your browser settings.");
    }
  };

  const stopScanning = () => {
    if (scanner) {
      try {
        scanner.clear();
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
      setScanner(null);
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      // If it's already a duplicate scan, ignore further processing
      if (isDuplicateScan) {
        return;
      }

      stopScanning();
      setScanResult(decodedText);
      
      const result = await logQRScan({
        qrCode: decodedText,
        device: navigator.userAgent,
        location: "Main Entrance",
      });

      if (result.error) {
        if (result.isDuplicate) {
          setIsDuplicateScan(true);
          toast.dismiss();
          toast.error("This QR code has already been scanned today", {
            duration: 3000,
            id: 'qr-scan-result',
          });
        } else {
          toast.dismiss();
          toast.error(result.error, {
            duration: 3000,
            id: 'qr-scan-result',
          });
        }
      } else {
        setShowSuccess(true);
        toast.dismiss();
        toast.success("QR code scanned successfully", {
          duration: 3000,
          id: 'qr-scan-result',
        });

        // Hide success animation after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.dismiss();
      toast.error("Failed to process QR code", {
        duration: 3000,
        id: 'qr-scan-result',
      });
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
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-full p-4 animate-bounce">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>
      )}

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