import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { UserList } from './components/user-list'
import { getUsers } from './components/user-management'
import { getCurrentUser } from '@/hooks/use-current-user'

export default async function UserManagementPage() {
  const session = await getCurrentUser();

  // Check if the user is logged in and has the admin role
  if (!session || session.roles !== 'Administrator') {
    redirect('/dashboard')
  }

  const { users, totalUsers } = await getUsers()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <Suspense fallback={<div>Loading users...</div>}>
        <UserList initialUsers={users} totalUsers={totalUsers} />
      </Suspense>
    </div>
  )
}

