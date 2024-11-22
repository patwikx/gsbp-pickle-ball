import { Suspense } from 'react'
import { CreateGroupForm } from './components/create-group-form'
import { GroupList } from './components/group-list'


export default function GroupsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Group Management</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
          <CreateGroupForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
          <Suspense fallback={<div>Loading groups...</div>}>
            <GroupList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

