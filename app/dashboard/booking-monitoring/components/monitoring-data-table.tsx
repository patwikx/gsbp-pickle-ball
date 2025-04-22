'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  MoreHorizontal, 
  ArrowUpDown,
  Calendar,
  Clock,
  Users,
  User,
  Copy,
  Eye,
  Edit,
  Trash2,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/utils/date-utils";
import { Avatar, AvatarFallback,  } from "@/components/ui/avatar";

type Booking = {
  id: string;
  courtId: number;
  userId: string;
  date: string;
  time: string;
  user: {
    name: string | null;
    email: string | null;
  };
  invitedPlayers: {
    name: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

function BookingDetailsDialog({ booking, open, onOpenChange }: { 
  booking: Booking; 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h3 className="font-medium">Date & Time</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(booking.date)} at {formatTime(booking.time)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Badge className="w-16 h-6">
              <h3 className="font-medium">Court {booking.courtId}</h3>
              </Badge>

            </div>
       
          </div>

          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-medium">Booked By</h3>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">{booking.user.name}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <h3 className="font-medium">Invited Players</h3>
            </div>
            {booking.invitedPlayers.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {booking.invitedPlayers.map((player, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{player.name ? player.name.charAt(0) : "N"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{player.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No invited players</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h3 className="font-medium">Booking Created</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {booking.createdAt.toLocaleDateString()} at {booking.createdAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Separate component for the actions cell
function BookingActions({ booking }: { booking: Booking }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => navigator.clipboard.writeText(booking.id)}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" /> Copy Booking ID
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit Booking
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 text-red-600"
            onClick={() => {
              // TODO: Implement cancel booking
            }}
          >
            <Trash2 className="h-4 w-4" /> Cancel Booking
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BookingDetailsDialog 
        booking={booking}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "courtId",
    header: "Court",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="outline">Court {row.getValue("courtId")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(row.getValue("date"))}
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {formatTime(row.getValue("time"))}
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Booked By",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {user.name}
        </div>
      );
    },
  },
  {
    accessorKey: "invitedPlayers",
    header: "Players",
    cell: ({ row }) => {
      const players = row.getValue("invitedPlayers") as { name: string | null }[];
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {players.length} players
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <BookingActions booking={row.original} />
  },
];

export function BookingsDataTable({ data }: { data: Booking[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter courts..."
          value={(table.getColumn("courtId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("courtId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}