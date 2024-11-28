'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Lock, Trash, Loader2, Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { changeUserPassword, deleteUser, updateUser } from './user-management'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { RegisterForm } from '@/components/auth/register-form'

interface User {
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
}

interface UserListProps {
  initialUsers: User[]
  totalUsers: number
}

export const revalidate = 0

export function UserList({ initialUsers, totalUsers }: UserListProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingUser, setIsDeletingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 10
  const { toast } = useToast()

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

  const totalPages = Math.ceil(totalUsers / pageSize)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handlePageChange = (newPage: number) => {
    setIsLoading(true)
    router.push(`/user-management?page=${newPage}`)
    setTimeout(() => setIsLoading(false), 500) // Simulating loading for smoother transitions
  }

  const handleChangePassword = async () => {
    if (selectedUser && newPassword) {
      setIsChangingPassword(true)
      try {
        const result = await changeUserPassword(selectedUser.id, newPassword)
        if (result.success) {
          setIsChangePasswordOpen(false)
          setNewPassword('')
          toast({
            title: "Success",
            description: `${selectedUser.name}'s password has been changed successfully.`,
          })
        } else {
          toast({
            title: "Error",
            description: result.message || 'Failed to change password',
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error changing password:", error)
        toast({
          title: "Error",
          description: "Something went wrong while changing password",
          variant: "destructive",
        })
      } finally {
        setIsChangingPassword(false)
      }
    }
  }

  const handleDeleteUser = async () => {
    if (selectedUser) {
      setIsDeletingUser(true)
      try {
        const result = await deleteUser(selectedUser.id)
        if (result.success) {
          setIsDeleteConfirmOpen(false)
          setUsers(users.filter(user => user.id !== selectedUser.id))
          toast({
            title: "User deleted",
            description: "The user has been successfully deleted.",
          })
        } else {
          toast({
            title: "Error",
            description: result.message || 'Failed to delete user. Please try again.',
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: "Something went wrong while deleting user. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeletingUser(false)
      }
    }
  }

  const handleUpdateUser = async () => {
    if (selectedUser) {
      setIsUpdatingUser(true)
      try {
        const emailVerified = selectedUser.emailVerified ?? false; // Ensure emailVerified is boolean
        const result = await updateUser(selectedUser.id, { emailVerified })
        if (result.success) {
          setIsEditUserOpen(false)
          setUsers(users.map(user => user.id === selectedUser.id ? { ...user, emailVerified } : user))
          toast({
            title: "Success",
            description: `${selectedUser.name}'s information has been updated successfully.`,
          })
        } else {
          toast({
            title: "Error",
            description: result.message || 'Failed to update user',
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error updating user:", error)
        toast({
          title: "Error",
          description: "Something went wrong while updating user",
          variant: "destructive",
        })
      } finally {
        setIsUpdatingUser(false)
      }
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <RegisterForm />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new user to the system</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Member ID</TableHead>
                  <TableHead className="w-[100px]">User</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date of Registration</TableHead>
                  <TableHead>Date of Renewal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array(pageSize).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={11}><Skeleton className="h-12 w-full" /></TableCell>
                      </TableRow>
                    ))
                  : paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{user.id || 'N/A'}</TableCell>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>{user.contactNo || 'N/A'}</TableCell>
                        <TableCell>{user.address || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={user.roles === 'Administrator' ? 'default' : 'secondary'}>
                            {user.roles || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{user.renewalDate ? new Date(user.renewalDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
                            {user.emailVerified ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user)
                                setIsEditUserOpen(true)
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user)
                                setIsChangePasswordOpen(true)
                              }}>
                                <Lock className="mr-2 h-4 w-4" />
                                <span>Change Password</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user)
                                setIsDeleteConfirmOpen(true)
                              }}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalUsers)} of {totalUsers} users
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
          <Label htmlFor="emailVerified">Activate member status?</Label>
            <Switch
              id="emailVerified"
              checked={selectedUser?.emailVerified || false}
              onCheckedChange={(checked) => setSelectedUser(prev => prev ? { ...prev, emailVerified: checked } : null)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateUser} disabled={isUpdatingUser}>
              {isUpdatingUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating User
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter a new password for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleChangePassword} disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isDeletingUser}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeletingUser}>
              {isDeletingUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting User
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

