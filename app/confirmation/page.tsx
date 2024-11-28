"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
}

export default function ConfirmationModal({ isOpen, onClose, registrationId }: ConfirmationModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const saveAsImage = async () => {
    if (contentRef.current) {
      try {
        // Set white background for better image capture
        const canvas = await html2canvas(contentRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher resolution
        });
        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = image;
        link.download = `registration-confirmation-${registrationId}.png`;
        link.click();
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <div ref={contentRef} className="bg-white p-6 rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold mb-2">Registration Successful</DialogTitle>
              <DialogDescription className="text-base">
                Your membership is pending activation
              </DialogDescription>
            </DialogHeader>
          </div>

          <Card className="border border-gray-350 shadow-sm">
            <CardContent className="p-6">
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <p className="text-center font-semibold mb-2">Registration ID</p>
                <p className="text-center font-mono text-lg">{registrationId}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Thank you for registering. Your account has been created, but your membership is currently pending. 
                  Please note down your Registration ID and present this to the front desk for account activation upon successful payment.
                </p>

                <div>
                  <p className="font-semibold mb-3">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li className="pl-2">Visit our office cashier</li>
                    <li className="pl-2">Pay the account activation fee of 1000 PHP</li>
                    <li className="pl-2">Your account will be activated after payment confirmation</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground text-center mt-4">
            Please keep this confirmation for your records
          </div>
        </div>

        <CardFooter className="flex justify-between gap-4 px-0 pt-4">
          <Button 
            onClick={saveAsImage} 
            variant="outline" 
            className="flex-1"
          >
            Save as Image
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}

