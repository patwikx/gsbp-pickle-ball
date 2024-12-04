export interface User {
    id: string;
    name: string | null;
    email: string | null;
  }
  
  export interface Booking {
    id: string;
    courtId: number;
    userId: string;
    date: string;
    time: string;
    user: User;
    invitedPlayers: User[];
  }
  
  export interface BookingStats {
    totalBookings: number;
    todayBookings: number;
  }

  export interface BookingStatsx {
    total: number
    upcoming: number
    past: number
  }
  
  