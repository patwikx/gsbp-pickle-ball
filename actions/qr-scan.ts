'use server'

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface ScanQRParams {
  qrCode: string;
  location?: string;
  device?: string;
}

interface GetScanHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
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

export async function getScanHistory({
  page = 1,
  limit = 10,
  search = "",
  dateFrom,
  dateTo,
  location,
  device
}: GetScanHistoryParams = {}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const skip = (page - 1) * limit;

    // Build where conditions
    let whereConditions: {
      OR?: Array<{ user: { OR: Array<{ name: { contains: string, mode: 'insensitive' } } | { email: { contains: string, mode: 'insensitive' } }> } } | { location: { contains: string, mode: 'insensitive' } }>,
      scannedAt?: { gte?: Date, lte?: Date },
      location?: string,
      device?: string
    } = {};

    // Add search conditions
    if (search) {
      whereConditions = {
        OR: [
          {
            user: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
              ]
            }
          },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    // Add date range conditions
    if (dateFrom) {
      whereConditions.scannedAt = {
        ...(whereConditions.scannedAt || {}),
        gte: dateFrom
      };
    }

    if (dateTo) {
      whereConditions.scannedAt = {
        ...(whereConditions.scannedAt || {}),
        lte: dateTo
      };
    }

    // Add location and device filters
    if (location) {
      whereConditions.location = location;
    }

    if (device) {
      whereConditions.device = device;
    }

    const [scans, total] = await Promise.all([
      prismadb.qRScan.findMany({
        where: whereConditions,
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
        skip,
        take: limit,
      }),
      prismadb.qRScan.count({ where: whereConditions })
    ]);

    return {
      data: scans,
      total
    };
  } catch (error) {
    console.error("Failed to get scan history:", error);
    return {
      data: [],
      total: 0
    };
  }
}