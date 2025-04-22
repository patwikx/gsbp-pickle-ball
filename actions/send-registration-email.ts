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

export async function sendRegistrationEmail(params: {
  email: string;
  name: string;
  registrationId: string;
  contactNo: string | null;
  address: string | null;
}) {
  const { email, name, registrationId, contactNo, address } = params;

  const createEmailHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Confirmation</title>
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
                        Registration Confirmation
                      </h2>
                      
                      <p style="margin: 0 0 20px;">
                        Dear ${name},
                      </p>
                      
                      <p style="margin: 0 0 30px;">
                        Thank you for registering with the General Santos Business Park Pickleball Court Booking System. Your account has been successfully created.
                      </p>
                      
                      <!-- Registration Details -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Registration Details</h3>
                            <p style="margin: 0 0 10px;"><strong>Registration ID:</strong> ${registrationId}</p>
                            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 0 0 10px;"><strong>Contact No.:</strong> ${contactNo}</p>
                            <p style="margin: 0 0 10px;"><strong>Address:</strong> ${address}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Next Steps -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Next Steps</h3>
                            <ol style="margin: 0; padding-left: 20px; color: #475569;">
                              <li style="margin-bottom: 10px;">Choose your preferred payment method (see Payment Options below).</li>
                              <li style="margin-bottom: 10px;">Pay the account activation fee of 1000 PHP.</li>
                              <li style="margin-bottom: 10px;">Your account will be activated after payment confirmation.</li>
                              <li style="margin-bottom: 10px;">Log in to your account using your registered email and password.</li>
                              <li style="margin-bottom: 10px;">Complete your profile by adding any additional required information.</li>
                              <li style="margin-bottom: 10px;">Familiarize yourself with our booking system and court guidelines.</li>
                              <li style="margin-bottom: 10px;">Start booking your preferred pickleball court slots!</li>
                            </ol>
                          </td>
                        </tr>
                      </table>

                      <!-- Payment Options -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Payment Options</h3>
                            
                            <!-- Office Payment -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                              <tr>
                                <td style="padding: 15px; background-color: #ffffff; border-radius: 8px;">
                                  <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 10px;">Office Payment</h4>
                                  <p style="margin: 0 0 5px;">Pay at our office cashier:</p>
                                  <p style="margin: 0 0 5px;"><strong>RD REALTY DEVELOPMENT CORPORATION</strong></p>
                                  <p style="margin: 0 0 5px;">General Santos Business Park, National Highway</p>
                                  <p style="margin: 0;">General Santos City, Philippines</p>
                                </td>
                              </tr>
                            </table>

                            <!-- Fund Transfer -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td style="padding: 15px; background-color: #ffffff; border-radius: 8px;">
                                  <h4 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 10px;">Fund Transfer</h4>
                                  
                                  <!-- BPI Account -->
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 15px;">
                                    <tr>
                                      <td>
                                        <img src="https://utfs.io/f/pUvyWRtocgCVCbT7HilK38AKlBqGNT7RI5pYizjQHwtvsrfV" alt="BPI Logo" width="60" height="25" style="display: block; margin-bottom: 10px;">
                                        <p style="margin: 0 0 5px;"><strong>Account Name:</strong> RD REALTY DEVELOPMENT CORPORATION</p>
                                        <p style="margin: 0;"><strong>Account Number:</strong> 2150-0024-11</p>
                                      </td>
                                    </tr>
                                  </table>

                                  <!-- Security Bank Account -->
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                      <td>
                                        <img src="https://utfs.io/f/pUvyWRtocgCVc3B7N69o4LvgUGbQwfjl5t3FziTsKSZAda90" alt="Security Bank Logo" width="125" height="50" style="display: block; margin-bottom: 10px;">
                                        <p style="margin: 0 0 5px;"><strong>Account Name:</strong> RD REALTY DEVELOPMENT CORPORATION</p>
                                        <p style="margin: 0;"><strong>Account Number:</strong> 411-014382-001</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Contact Information -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e0f2fe; border-radius: 8px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Need help with payment?</h3>
                            <p style="margin: 0 0 10px;">For any questions or concerns, please contact GSBPPBC:</p>
                            <p style="margin: 0 0 5px;">Phone: <a href="tel:+639992202427" style="color: #2563eb; text-decoration: none;">+63 999 220 2427</a></p>
                            <p style="margin: 0;">Email: <a href="mailto:pmd.associate@rdretailgroup.com.ph" style="color: #2563eb; text-decoration: none;">pmd.associate@rdretailgroup.com.ph</a></p>
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

  // Send registration confirmation email
  await sendEmail({
    to: email,
    subject: 'Welcome to GSBP Pickleball Court Booking System',
    html: createEmailHTML()
  });

  return { success: true };
}

