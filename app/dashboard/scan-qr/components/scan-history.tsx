"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getScanHistory } from "@/actions/qr-scan";

interface ScanRecord {
  id: string;
  scannedAt: Date;
  location: string;
  device: string;
  user: {
    name: string;
    email: string;
  };
}

export function ScanHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getScanHistory();
        setScans(
          history.map((record) => ({
            ...record,
            location: record.location ?? "Unknown location",
            device: record.device ?? "Unknown device",
            user: {
              name: record.user.name ?? "Unknown name",
              email: record.user.email ?? "Unknown email",
            },
          }))
        );
      } catch (error) {
        console.error("Failed to load scan history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Device</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans.map((scan) => (
            <TableRow key={scan.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{scan.user.name}</p>
                  <p className="text-sm text-muted-foreground">{scan.user.email}</p>
                </div>
              </TableCell>
              <TableCell>{format(new Date(scan.scannedAt), "PPpp")}</TableCell>
              <TableCell>{scan.location}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {scan.device}
              </TableCell>
            </TableRow>
          ))}
          {scans.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No scan history found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}