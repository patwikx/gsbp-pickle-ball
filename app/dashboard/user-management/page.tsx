import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { UserList } from './components/user-list'
import { getUsers } from './components/user-management'
import { getCurrentUser } from '@/hooks/use-current-user'
import { Loader } from '@/components/ui/loader'

export default async function UserManagementPage() {
  const session = await getCurrentUser();
  if (!session){
    redirect('/auth/sign-in')
  }
  // Check if the user is logged in and has the admin role
  if (!session || session.roles !== 'Administrator') {
    redirect('/dashboard')
  }

  const { users, totalUsers } = await getUsers()

  return (
    <div className="container mx-auto py-10">

      <Suspense fallback={<div><Loader /></div>}>
        <UserList initialUsers={users} totalUsers={totalUsers} />
      </Suspense>
    </div>
  )
}

