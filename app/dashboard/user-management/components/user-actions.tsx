import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Lock, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { User } from '@/types/user'

interface UserActionsProps {
  user: User
  onChangePassword: (user: User) => void
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
}

export function UserActions({ user, onChangePassword, onEditUser, onDeleteUser }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEditUser(user)} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangePassword(user)} className="cursor-pointer">
          <Lock className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDeleteUser(user)}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}