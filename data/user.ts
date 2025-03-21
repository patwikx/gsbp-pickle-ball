import { prismadb } from "@/lib/db";


export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id }, 
     }
    );
    
    return user;
  } catch {
    return null;
  }
};

export const getEmailByUserId = async (userId: string) => {
  const user = await prismadb.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  return [user.name];
};

export const getEmailByUserIdUpload = async (userId: string) => {
  const user = await prismadb.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  return user.email;
};

export const getEmailByApproverId = async (approverId: string) => {
  const user = await prismadb.user.findUnique({
    where: { id: approverId },
    select: { email: true, name: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  return user.email;
};