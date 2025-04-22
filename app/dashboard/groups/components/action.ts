'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

import { CreateGroupFormData, GroupWithMembers } from '@/types/groups'
import { prismadb } from '@/lib/db';

export async function createGroup(data: CreateGroupFormData) {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('You must be logged in to create a group')
    }
  
    const group = await prismadb.group.create({
      data: {
        name: data.name,
        description: data.description || null,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'OWNER',
          },
        },
      },
    })
  
    revalidatePath('/dashboard/groups')
    return group
  }

export async function getGroups(): Promise<GroupWithMembers[]> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to view groups')
  }

  const groups = await prismadb.group.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })

  const groupsWithMembers = groups.map(group => {
    return {
      ...group,
      members: group.members.map(member => ({
        ...member,
        role: member.role as 'OWNER' | 'ADMIN' | 'MEMBER',
      })),
    }
  })

  return groupsWithMembers
}

export async function addMemberToGroup(groupId: string, email: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to add members')
  }

  const group = await prismadb.group.findUnique({
    where: { id: groupId },
    include: { members: true },
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const isAdmin = group.members.some(
    (member) => member.userId === session.user.id && ['OWNER', 'ADMIN'].includes(member.role)
  )

  if (!isAdmin) {
    throw new Error('You do not have permission to add members to this group')
  }

  const user = await prismadb.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('User not found')
  }

  await prismadb.groupMembership.create({
    data: {
      groupId,
      userId: user.id,
      role: 'MEMBER',
    },
  })

  revalidatePath('/groups')
}

export async function removeGroupMember(groupId: string, membershipId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to remove members')
  }

  const group = await prismadb.group.findUnique({
    where: { id: groupId },
    include: { members: true },
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const isAdmin = group.members.some(
    (member) => member.userId === session.user.id && ['OWNER', 'ADMIN'].includes(member.role)
  )

  if (!isAdmin) {
    throw new Error('You do not have permission to remove members from this group')
  }

  await prismadb.groupMembership.delete({
    where: { id: membershipId },
  })

  revalidatePath('/groups')
}

export async function deleteGroup(groupId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to delete a group')
  }

  const group = await prismadb.group.findUnique({
    where: { id: groupId },
    include: { members: true },
  })

  if (!group) {
    throw new Error('Group not found')
  }

  if (group.ownerId !== session.user.id) {
    throw new Error('You do not have permission to delete this group')
  }

  // Delete all memberships
  await prismadb.groupMembership.deleteMany({
    where: { groupId },
  })

  // Delete the group
  await prismadb.group.delete({
    where: { id: groupId },
  })

  revalidatePath('/groups')
}

