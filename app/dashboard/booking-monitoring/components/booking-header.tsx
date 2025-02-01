import { Button } from "@/components/ui/button";

import { 
  Download, 
  Upload, 
  RefreshCw,
  PlusCircle 
} from "lucide-react";
import { CalendarDateRangePicker } from "./date-range-picker";

export function BookingsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings Monitor</h1>
        <p className="text-muted-foreground">
          Manage and monitor all court bookings in one place
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <CalendarDateRangePicker />
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>
    </div>
  );
}