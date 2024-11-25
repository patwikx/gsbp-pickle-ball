import { Suspense } from 'react'
import { UserList } from './components/user-list'
import { getUsers } from './components/user-management'


export default async function UserManagementPage() {
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

