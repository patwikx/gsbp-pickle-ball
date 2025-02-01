"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { getScanHistory } from "@/actions/qr-scan"
import { Badge } from "@/components/ui/badge"

import {
  Download,
  Search,
  RefreshCw,
  MoreVertical,
  Printer,
  FileText,
  MapPin,
  Smartphone,
  User,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { useDebounce } from "@/utils/use-debounce"
import { DataTablePagination } from "../../scan-qr-history/components/data-table-pagination"
import { DateRangePicker } from "@/components/ui/date-range-picker"

interface ScanRecord {
  id: string
  scannedAt: Date
  location: string
  device: string
  user: {
    name: string
    email: string
  }
}

interface FilterState {
  search: string
  dateRange: { from: Date | undefined; to: Date | undefined }
  location: string
  device: string
}

const ITEMS_PER_PAGE = 10

export function ScanHistoryView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1

  const [scans, setScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateRange: { from: undefined, to: undefined },
    location: "all",
    device: "",
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      const history = await getScanHistory({
        page,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
        dateFrom: filters.dateRange.from,
        dateTo: filters.dateRange.to,
        location: filters.location === "all" ? undefined : filters.location,
        device: filters.device,
      })

      setScans(
        history.data.map((scan) => ({
          ...scan,
          location: scan.location || "",
          device: scan.device || "",
          user: {
            ...scan.user,
            name: scan.user.name || "",
            email: scan.user.email || "",
          },
        })),
      )
      setTotalItems(history.total)
    } catch (error) {
      console.error("Failed to load scan history:", error)
      toast.error("Failed to load scan history")
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, filters.dateRange, filters.location, filters.device])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const exportToCSV = () => {
    try {
      const exportData = scans.map((scan) => ({
        "User Name": scan.user.name,
        "User Email": scan.user.email,
        "Scan Time": format(new Date(scan.scannedAt), "PPpp"),
        Location: scan.location,
        Device: scan.device,
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const csv = XLSX.utils.sheet_to_csv(ws)

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "scan-history.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Successfully exported to CSV")
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Failed to export data")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <Card className="p-4 print:hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or location..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="pl-8"
              />
            </div>
            <DateRangePicker
              value={filters.dateRange}
              onChange={(range) =>
                setFilters((f) => ({ ...f, dateRange: { from: range?.from || undefined, to: range?.to || undefined } }))
              }
            />
            <Select value={filters.location} onValueChange={(value) => setFilters((f) => ({ ...f, location: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Main Entrance">Main Entrance</SelectItem>
                <SelectItem value="Side Gate">Side Gate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={loadHistory} className="hover:bg-muted">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover:bg-muted">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <Card className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-left">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>User</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-left">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Time</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-left">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-left">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Device</span>
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-muted/50">
                    <TableCell>
                      <Skeleton className="h-6 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[20px]" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  {scans.map((scan) => (
                    <TableRow key={scan.id} className="hover:bg-muted/50">
                      <TableCell className="min-w-[250px] text-left">
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{scan.user.name}</span>
                          <span className="text-sm text-muted-foreground">{scan.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px] text-left">
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{format(new Date(scan.scannedAt), "PPP")}</span>
                          <span className="text-sm text-muted-foreground">{format(new Date(scan.scannedAt), "p")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[150px] text-left">
                        <Badge variant="secondary" className="font-normal">
                          {scan.location}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[200px] max-w-[300px] text-left">
                        <span className="text-sm text-muted-foreground truncate block">{scan.device}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              View User Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {scans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-8 w-8 mb-2" />
                          <p className="text-sm">No scan history found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="print:hidden">
        <DataTablePagination
          currentPage={page}
          totalItems={totalItems}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={(newPage) => {
            const params = new URLSearchParams(searchParams)
            params.set("page", newPage.toString())
            router.push(`?${params.toString()}`)
          }}
        />
      </div>
    </div>
  )
}

ScanHistoryView.Skeleton = function ScanHistorySkeleton() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </Card>

      <Card>
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  )
}

