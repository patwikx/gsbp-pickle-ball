'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Users, UserPlus, Loader2, Shield, ShieldCheck, UserX, Mail, Trash2 } from 'lucide-react'
import { GroupWithMembers } from '@/types/groups'
import { cn } from '@/lib/utils'
import { addMemberToGroup, deleteGroup, removeGroupMember } from './action'
import { toast } from '@/hooks/use-toast'

interface GroupCardProps {
  group: GroupWithMembers
  isOwner: boolean
}

export function GroupCard({ group, isOwner }: GroupCardProps) {
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)
  const [isDeletingGroup, setIsDeletingGroup] = useState(false)
  const router = useRouter()

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingMember(true)
    try {
      await addMemberToGroup(group.id, newMemberEmail)
      setNewMemberEmail('')
      router.refresh()
      toast({
        title: "Success",
        description: `Invitation sent to ${newMemberEmail}`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    setRemovingMemberId(memberId)
    try {
      await removeGroupMember(group.id, memberId)
      router.refresh()
      toast({
        title: "Member removed",
        description: "The member has been removed from the group.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRemovingMemberId(null)
    }
  }

  const handleDeleteGroup = async () => {
    setIsDeletingGroup(true)
    try {
      await deleteGroup(group.id)
      router.refresh()
      toast({
        title: "Group deleted",
        description: "The group has been successfully deleted.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete group. Please try again.",
        variant: "destructive",
      })
      setIsDeletingGroup(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <ShieldCheck className="h-4 w-4" />
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">{group.name}</CardTitle>
            <CardDescription className="text-base">
              {group.description || "No description provided"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="h-7 px-3 text-sm">
              <Users className="mr-1 h-4 w-4" />
              {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
            </Badge>
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Group
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      group and remove all member associations.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteGroup}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeletingGroup ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>Delete</>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {group.members.map((member) => (
            <div
              key={member.id}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-secondary/5 hover:bg-secondary/10"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src={member.user.image || undefined} />
                  <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                    {member.user.name?.[0] || member.user.email?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium leading-none">
                    {member.user.name || member.user.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={member.role === 'OWNER' ? 'default' : 'secondary'}
                      className="h-5 text-xs"
                    >
                      {getRoleIcon(member.role)}
                      <span className="ml-1">{member.role}</span>
                    </Badge>
                    {member.user.email && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.user.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {isOwner && member.role !== 'OWNER' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={removingMemberId === member.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                >
                  {removingMemberId === member.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserX className="h-4 w-4" />
                  )}
                  <span className="ml-2">Remove</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-6 bg-secondary/5">
        <form onSubmit={handleAddMember} className="flex w-full gap-2">
          <div className="relative flex-grow">
            <Input
              type="email"
              placeholder="Add member by email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              required
              className="pr-32"
            />
            <Button 
              type="submit" 
              disabled={isAddingMember}
              className="absolute right-0 top-0 h-full rounded-l-none"
            >
              {isAddingMember ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}

