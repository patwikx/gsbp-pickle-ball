import { Suspense } from 'react'

import { GroupCard } from './group-card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, AlertTriangle } from 'lucide-react'
import { auth } from '@/auth'
import { getGroups } from './action'

function GroupListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="w-full h-[200px] rounded-lg" />
      ))}
    </div>
  )
}

async function GroupListContent() {
  const session = await auth()
  const groups = await getGroups()

  if (groups.length === 0) {
    return (
      <Alert>
        <Users className="h-4 w-4" />
        <AlertTitle>No groups found</AlertTitle>
        <AlertDescription>
          You haven&apos;t created or joined any groups yet. Create a new group to get started!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <GroupCard 
          key={group.id} 
          group={group} 
          isOwner={group.ownerId === session?.user?.id}
        />
      ))}
    </div>
  )
}

export function GroupList() {
  return (
    <Suspense fallback={<GroupListSkeleton />}>
      <GroupListContent />
    </Suspense>
  )
}

export function GroupListError() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was a problem loading your groups. Please try again later.
      </AlertDescription>
    </Alert>
  )
}

