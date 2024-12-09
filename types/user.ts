export interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
    contactNo: string | null
    address: string | null
    roles: string | null
    createdAt: Date | null
    renewalDate: Date | null
    emailVerified: boolean | null
    proofPayment: string | null
  }
  
  export interface UserListProps {
    initialUsers: User[]
    totalUsers: number
}

export interface UserActionResult {
  success: boolean
  message?: string
  data?: Record<string, unknown> // specify a more specific type than 'any'
}