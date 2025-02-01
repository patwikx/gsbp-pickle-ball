'use server'

import { auth } from '@/auth';
import { prismadb } from '@/lib/db';
import nodemailer from 'nodemailer';

interface EmailBlastParams {
  subject: string;
  template: string;
  content: string;
  html: string;
  sendToAll: boolean;
  testEmail?: string;
}

export async function sendEmailBlast(params: EmailBlastParams) {
  try {
    const currentUser = await auth();
    
    if (!currentUser || !currentUser.user.email) {
      return { success: false, error: 'Unauthorized' };
    }

    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
    
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    let recipients: string[];

    if (params.sendToAll) {
      // Get all users' emails
      const users = await prismadb.user.findMany({
        where: {
          email: {
            not: null,
          },
          emailVerified: true,
        },
        select: {
          email: true,
        },
      });
      recipients = users.map(user => user.email!);
    } else {
      // Send to test email only
      if (!params.testEmail) {
        return { success: false, error: 'Test email is required when not sending to all users' };
      }
      recipients = [params.testEmail];
    }

    // Send emails in batches of 50
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      await transport.sendMail({
        from: SMTP_EMAIL,
        bcc: batch,
        subject: params.subject,
        html: params.html,
        headers: {
          'X-Entity-Ref-ID': `${new Date().getTime()}-${Math.random().toString(36).substring(7)}`,
        },
      });
      
      // Add delay between batches to prevent rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Log the email blast
    await prismadb.emailLog.create({
      data: {
        subject: params.subject,
        template: params.template,
        content: params.content,
        recipientCount: recipients.length,
        sentBy: currentUser.user.id,
        sentAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Email blast error:', error);
    return { success: false, error: 'Failed to send email blast' };
  }
}