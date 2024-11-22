import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prismadb } from '@/lib/db'


export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const groupId = params.groupId

    const groupMembers = await prismadb.groupMembership.findMany({
      where: {
        groupId: groupId,
      },
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
    })

    return NextResponse.json(groupMembers)
  } catch (error) {
    console.error("[GROUP_MEMBERS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

