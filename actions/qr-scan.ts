'use server'

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface ScanQRParams {
  qrCode: string;
  location?: string;
  device?: string;
}

export async function logQRScan({ qrCode, location, device }: ScanQRParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Find the user by QR code
    const scannedUser = await prismadb.user.findUnique({
      where: { qrCode },
    });

    if (!scannedUser) {
      return { error: "Invalid QR code" };
    }

      // Check for existing scan in the last 24 hours
      const existingScan = await prismadb.qRScan.findFirst({
        where: {
          userId: scannedUser.id,
          scannedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });
  
      if (existingScan) {
        return { error: "Duplicate scan", isDuplicate: true };
      }

    // Create scan record
    const scan = await prismadb.qRScan.create({
      data: {
        userId: scannedUser.id,
        location: location || "Unknown",
        device: device || "Unknown",
      },
    });

    return { success: true, scan };
  } catch (error) {
    console.error("QR scan error:", error);
    return { error: "Failed to log QR scan" };
  }
}

export async function getScanHistory() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const scans = await prismadb.qRScan.findMany({
      orderBy: {
        scannedAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      take: 30, // Limit to last 50 scans
    });

    return scans;
  } catch (error) {
    console.error("Failed to get scan history:", error);
    return [];
  }
}