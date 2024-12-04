'use server'

import nodemailer from 'nodemailer'

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    // console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

export async function sendActivationEmailSuccess(params: {
  email: string;
  name: string;
  memberId: string;
}) {
  const { email, name, memberId } = params;

  const createEmailHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmed - Membership Activated</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #1e293b; background-color: #f1f5f9;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 0; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">General Santos Business Park</h1>
                      <p style="color: #e0f2fe; font-size: 18px; margin: 10px 0 0;">Pickleball Court Booking System</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1e40af; font-size: 24px; font-weight: 600; margin: 0 0 20px;">
                        Payment Confirmed - Membership Activated
                      </h2>
                      
                      <p style="margin: 0 0 20px;">
                        Dear ${name},
                      </p>
                      
                      <p style="margin: 0 0 30px;">
                        Great news! Your payment has been successfully processed, and your membership for the General Santos Business Park Pickleball Court Booking System is now active. You're all set to start booking courts and enjoying our facilities.
                      </p>
                      
                      <!-- Membership Details -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Membership Details</h3>
                            <p style="margin: 0 0 10px;"><strong>Member ID:</strong> ${memberId}</p>
                            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 0;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: 600;">Active</span></p>
                          </td>
                        </tr>
                      </table>

                      <!-- Next Steps -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">What's Next?</h3>
                            <ol style="margin: 0; padding-left: 20px; color: #475569;">
                              <li style="margin-bottom: 10px;">Log in to your account using your registered email and password.</li>
                              <li style="margin-bottom: 10px;">Complete your profile by adding any additional required information.</li>
                              <li style="margin-bottom: 10px;">Browse available court slots and start booking your preferred pickleball courts.</li>
                              <li style="margin-bottom: 10px;">Review our court rules and etiquette guidelines to ensure a great experience for everyone.</li>
                              <li style="margin-bottom: 10px;">Invite friends or join other members for exciting pickleball matches!</li>
                            </ol>
                          </td>
                        </tr>
                      </table>

                      <!-- Contact Information -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e0f2fe; border-radius: 8px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Contact Information</h3>
                            <p style="margin: 0 0 10px;">If you have any questions or need assistance, please don't hesitate to contact GSBPPBC:</p>
                            <p style="margin: 0 0 5px;">Email: <a href="mailto:pmd.associate@rdretailgroup.com.ph" style="color: #2563eb; text-decoration: none;">pmd.associate@rdretailgroup.com.ph</a></p>
                            <p style="margin: 0;">Phone: <a href="tel:+639992202427" style="color: #2563eb; text-decoration: none;">+63 999 220 2427</a></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1e40af; color: #ffffff; padding: 30px; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 14px;">This is an automated message from the GSBP Pickleball Court Booking System</p>
                      <p style="margin: 0; font-size: 14px;">&copy; 2024 General Santos Business Park. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  };

  // Send payment confirmation and activation email
  await sendEmail({
    to: email,
    subject: 'Payment Confirmed - Your GSBP Pickleball Membership is Now Active',
    html: createEmailHTML()
  });

  return { success: true };
}

