'use server'

import { prismadb } from "@/lib/db"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function getUsers(page = 1, pageSize = 10) {
  try {
    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        contactNo: true,
        address: true,
        roles: true,
        createdAt: true,
        renewalDate: true,
        emailVerified: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const totalUsers = await prismadb.user.count()

    return { users, totalUsers }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new Error('Failed to fetch users')
  }
}

export async function changeUserPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await hash(newPassword, 10)
    await prismadb.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    revalidatePath('/dashboard/user-management')
    return { success: true, message: "Password changed successfully" }
  } catch (error) {
    console.error("Failed to change password:", error)
    return { success: false, message: "Failed to change password" }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete related records first
    await prismadb.account.deleteMany({ where: { userId } })
    await prismadb.session.deleteMany({ where: { userId } })
    await prismadb.twoFactorConfirmation.deleteMany({ where: { userId } })
    await prismadb.groupMembership.deleteMany({ where: { userId } })
    await prismadb.booking.deleteMany({ where: { userId } })
    
    // Now delete the user
    await prismadb.user.delete({ where: { id: userId } })
    
    revalidatePath('/dashboard/user-management')
    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}

export async function updateUser(userId: string, data: { emailVerified?: boolean }) {
  try {
    await prismadb.user.update({
      where: { id: userId },
      data: data,
    })
    revalidatePath('/dashboard/user-management')
    return { success: true, message: "User updated successfully" }
  } catch (error) {
    console.error("Failed to update user:", error)
    return { success: false, message: "Failed to update user" }
  }
}
