'use server'

import { MemberRegisterSchema, NewPasswordSchema, RegisterUserSchema, ResetSchema, SettingsSchema } from "@/schemas";

import {  getUserByEmail, getUserById } from "@/data/user";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { prismadb } from "@/lib/db";
import { getCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";
import { sendRegistrationEmail } from "./send-registration-email";
import { sendNewRegistrationNotification } from "./registration-email-notif";
import { generateQRCode } from "@/lib/utils";



  export const settings = async (
    values: z.infer<typeof SettingsSchema>
  ) => {
    const user = await getCurrentUser();
  
    if (!user) {
      return { error: "Unauthorized" }
    }
  
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" }
    }

  
    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);
  
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" }
      }
  

      return { success: "Verification email sent!" };
    }
  
    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );
  
      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }
  
      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

  
    return { success: "Settings Updated!" }
  }

  export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid emaiL!" };
    }
  
    const { email } = validatedFields.data;
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser) {
      return { error: "Email not found!" };
    }
  
    return { success: "Reset email sent!" };
  }


  export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema> ,
    token?: string | null,
  ) => {
    if (!token) {
      return { error: "Missing token!" };
    }
  
    const validatedFields = NewPasswordSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { password } = validatedFields.data;
  
    const existingToken = await getPasswordResetTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Invalid token!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" }
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prismadb.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { success: "Password updated!" };
  };




  export const memberRegister = async (values: z.infer<typeof MemberRegisterSchema>) => {
    const validatedFields = MemberRegisterSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { email, password, name, roles, contactNo, address, proofPayment } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return { error: "Email already in use!" };
    }
  
    const now = new Date();
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
    try {
      const newUser = await prismadb.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          renewalDate: oneYearFromNow,
          contactNo,
          address,
          roles,
          proofPayment,
        },
      });
  
      // Send registration confirmation email
       sendRegistrationEmail({
        contactNo: contactNo ?? null,
        address: address ?? null,
        email,
        name,
        registrationId: newUser.id,
      });

      //send registration notification to admin
        // Send registration confirmation email
        sendNewRegistrationNotification({
          contactNo: contactNo ?? null,
          address: address ?? null,
          email,
          name,
          memberId: newUser.id,
        });
  
      revalidatePath('/dashboard/user-management');
      return { success: "User registered successfully!", registrationId: newUser.id };
    } catch (error) {
      console.error("Registration failed:", error);
      return { error: "Registration failed. Please try again." };
    }
  };

  export async function fetchRegisteredPlayers() {
    try {
      const players = await prismadb.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
        },
      })
      return players
    } catch (error) {
      console.error("Failed to fetch registered players:", error)
      throw new Error("Failed to load registered players. Please try again.")
    }
  }


  export const registerUser = async (values: z.infer<typeof RegisterUserSchema>) => {
    const validatedFields = RegisterUserSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { email, password, name, roles, contactNo, address } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return { error: "Email already in use!" };
    }
  
    const now = new Date();
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
    const newUser = await prismadb.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        renewalDate: oneYearFromNow,
        contactNo,
        address,
        roles,
      },
    });
  
    revalidatePath('/dashboard/user-management')
    return { success: "User registered successfully!", registrationId: newUser.id };
  };
  

export async function generateUserQR(userId: string) {
  try {
    // Check if user already has a QR code
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      select: { qrCode: true }
    });

    if (user?.qrCode) {
      return { error: "QR code already exists" };
    }

    // Generate a unique QR code (you can customize this format)
    const qrCode = generateQRCode(userId);

    // Update user with new QR code
    await prismadb.user.update({
      where: { id: userId },
      data: { qrCode }
    });

    return { success: true, qrCode };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return { error: "Failed to generate QR code" };
  }
}
