import * as z from "zod"

export const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters").max(50, "Group name must be less than 50 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
})

export type CreateGroupFormData = z.infer<typeof createGroupSchema>



export interface Group {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface GroupMember {
    id: string;
    userId: string;
    groupId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }
  
  export interface GroupWithMembers extends Group {
    members: GroupMember[];
  }
  
  