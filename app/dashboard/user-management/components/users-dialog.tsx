'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { User } from '@/types/user'

interface UserDialogsProps {
  selectedUser: User | null
  isChangePasswordOpen: boolean
  isDeleteConfirmOpen: boolean
  isEditUserOpen: boolean
  isProcessing: boolean
  onClosePasswordDialog: () => void
  onCloseDeleteDialog: () => void
  onCloseEditDialog: () => void
  onConfirmPassword: (password: string) => void
  onConfirmDelete: () => void
}

export function UserDialogs({
  selectedUser,
  isChangePasswordOpen,
  isDeleteConfirmOpen,
  isEditUserOpen,
  isProcessing,
  onClosePasswordDialog,
  onCloseDeleteDialog,
  onCloseEditDialog,
  onConfirmPassword,
  onConfirmDelete,
}: UserDialogsProps) {
  const [newPassword, setNewPassword] = useState('')
  const [userData, setUserData] = useState<Partial<User>>({})

  return (
    <>
      <Dialog open={isChangePasswordOpen} onOpenChange={onClosePasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClosePasswordDialog}>
              Cancel
            </Button>
            <Button 
              onClick={() => onConfirmPassword(newPassword)} 
              disabled={isProcessing || !newPassword}
            >
              {isProcessing ? (
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

      <Dialog open={isDeleteConfirmOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onCloseDeleteDialog}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirmDelete}
              disabled={isProcessing}
            >
              {isProcessing ? (
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

      <Dialog open={isEditUserOpen} onOpenChange={onCloseEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Full Name"
                value={userData.name || selectedUser?.name || ''}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Email Address"
                value={userData.email || selectedUser?.email || ''}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input
                placeholder="Contact Number"
                value={userData.contactNo || selectedUser?.contactNo || ''}
                onChange={(e) => setUserData({ ...userData, contactNo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                placeholder="Address"
                value={userData.address || selectedUser?.address || ''}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}