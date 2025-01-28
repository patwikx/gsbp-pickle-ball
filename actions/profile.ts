"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNo: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function updateProfile(userId: string, values: z.infer<typeof ProfileSchema>) {
  try {
    const validatedFields = ProfileSchema.parse(values);

    await prismadb.user.update({
      where: { id: userId },
      data: {
        name: validatedFields.name,
        contactNo: validatedFields.contactNo,
        address: validatedFields.address,
        image: validatedFields.image,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Something went wrong" };
  }
}

export async function updatePassword(userId: string, values: z.infer<typeof PasswordSchema>) {
  try {
    const validatedFields = PasswordSchema.parse(values);

    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isValid = await bcrypt.compare(
      validatedFields.currentPassword,
      user.password
    );

    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.newPassword, 10);

    await prismadb.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Something went wrong" };
  }
}