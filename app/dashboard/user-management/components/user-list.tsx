'use client'

import { useState, useCallback } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserTableSkeleton } from './user-table-skeleton'
import { UserStatusBadge } from './user-status-badge'
import { User, UserListProps } from '@/types/user'
import { cn } from '@/lib/utils'
import { changeUserPassword, deleteUser, updateUser } from './user-management'
import { RegisterForm } from '@/components/auth/register-form'
import { UserDialogs } from './users-dialog'
import { UserActions } from './user-actions'

export const revalidate = 0

export function UserList({ initialUsers, totalUsers }: UserListProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const { toast } = useToast()



  const paginatedUsers = users.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  )
  const totalPages = Math.ceil(users.length / pagination.pageSize)

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }, [])

  const handleChangePassword = useCallback(async (password: string) => {
    if (!selectedUser) return

    setIsProcessing(true)
    try {
      const result = await changeUserPassword(selectedUser.id, password)
      if (result.success) {
        setIsChangePasswordOpen(false)
        toast({
          title: "Success",
          description: `${selectedUser.name}'s password has been changed successfully.`,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [selectedUser, toast])

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return

    setIsProcessing(true)
    try {
      const result = await deleteUser(selectedUser.id)
      if (result.success) {
        setIsDeleteConfirmOpen(false)
        setUsers(users => users.filter(user => user.id !== selectedUser.id))
        toast({
          title: "Success",
          description: "User has been successfully deleted.",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [selectedUser, toast])

  const handleUpdateUserStatus = useCallback(async (userId: string, status: boolean) => {
    try {
      const result = await updateUser(userId, { emailVerified: status })
      if (result.success) {
        setUsers(users => users.map(user => 
          user.id === userId ? { ...user, emailVerified: status } : user
        ))
        toast({
          title: "Success",
          description: `User status has been ${status ? 'activated' : 'deactivated'} successfully.`,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user status",
        variant: "destructive",
      })
    }
  }, [toast])

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <RegisterForm />
        </div>
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
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Total Users: {totalUsers}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className='text-center'>Member ID</TableHead>
                  <TableHead className="w-[100px]">User</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className='text-center'>Registration</TableHead>
                  <TableHead className='text-center'>Renewal</TableHead>
                  <TableHead className='text-center'>Status</TableHead>
                  <TableHead className='text-center'>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isProcessing ? (
                  <UserTableSkeleton count={pagination.pageSize} />
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className={cn(
                        "hover:bg-muted/50 transition-colors",
                        !user.emailVerified && "opacity-75"
                      )}
                    >
                      <TableCell className="font-medium">{user.id}</TableCell>
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
                          {user.roles || 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {user.renewalDate ? new Date(user.renewalDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <UserStatusBadge
                          isVerified={user.emailVerified}
                          isUpdating={isProcessing && selectedUser?.id === user.id}
                          onStatusChange={(status) => handleUpdateUserStatus(user.id, status)}
                        />
                      </TableCell>
                      <TableCell className='text-center'>
                        {user.proofPayment && user.proofPayment !== 'about:blank' ? (
                          <a
                            href={user.proofPayment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions       
                          user={user}
                          onChangePassword={(user) => {
                            setSelectedUser(user)
                            setIsChangePasswordOpen(true)
                          }}
                          onEditUser={(user) => {
                            setSelectedUser(user)
                            setIsEditUserOpen(true)
                          }}
                          onDeleteUser={(user) => {
                            setSelectedUser(user)
                            setIsDeleteConfirmOpen(true)
                          }}
                          onViewPayments={(user) => {
                            setSelectedUser(user)
                            // Add logic for viewing payments if needed
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.pageIndex * pagination.pageSize) + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, users.length)} of {users.length} users
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex === 0 || isProcessing}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.pageIndex + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum - 1)}
                    disabled={isProcessing}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex === totalPages - 1 || isProcessing}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <UserDialogs
        selectedUser={selectedUser}
        isChangePasswordOpen={isChangePasswordOpen}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        isEditUserOpen={isEditUserOpen}
        isProcessing={isProcessing}
        onClosePasswordDialog={() => setIsChangePasswordOpen(false)}
        onCloseDeleteDialog={() => setIsDeleteConfirmOpen(false)}
        onCloseEditDialog={() => setIsEditUserOpen(false)}
        onConfirmPassword={handleChangePassword}
        onConfirmDelete={handleDeleteUser}
      />
    </Card>
  )
}

