"use server";


import { prismadb } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmailResetPassword } from "./reset-password-email";

export async function resetPassword(email: string) {
  try {
    const user = await prismadb.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { success: true };
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the reset token
    await prismadb.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    // Send email
    await sendEmailResetPassword({
      to: email,
      subject: "Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Reset Your Password</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
              </div>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                ${resetUrl}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to process password reset" };
  }
}

export async function updatePassword({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  try {
    // Find valid token
    const resetToken = await prismadb.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prismadb.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prismadb.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Send confirmation email
    await sendEmailResetPassword({
      to: resetToken.email,
      subject: "Your password has been reset",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Password Reset Successful</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Password Reset Successful</h2>
              <p>Hello,</p>
              <p>Your password has been successfully reset.</p>
              <p>If you did not perform this action, please contact our support team immediately.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    return { success: false, error: "Failed to update password" };
  }
}