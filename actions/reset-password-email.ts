"use server";

import nodemailer from 'nodemailer';
import { prismadb } from "@/lib/db";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmailResetPassword({ to, subject, html }: SendEmailParams) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const result = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html,
    });

    // Log the email for audit purposes
    await prismadb.emailLog.create({
      data: {
        subject,
        template: 'system', // You can make this more specific
        content: html,
        recipientCount: 1,
        sentBy: 'system', // Since this is a system email
        sentAt: new Date(),
      },
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}