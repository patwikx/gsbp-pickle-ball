'use server'

import nodemailer from 'nodemailer'
import { format, parse } from 'date-fns'

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

export async function sendBookingEmails(params: {
  bookerEmail: string;
  bookerName: string;
  invitedPlayers: { id: string; name: string; email: string }[];
  selectedSlots: string[];
  courtName: string;
  bookingIds: string[];
}) {
  const { bookerEmail, bookerName, invitedPlayers, selectedSlots, courtName, bookingIds } = params;

  const createEmailHTML = (isBooker: boolean, playerName?: string) => {
    const slotDetails = selectedSlots.map((slot) => {
      const [, year, month, day, time] = slot.split('-');
      const date = `${year}-${month}-${day}`;
      
      const parsedTime = parse(time, 'HH:mm', new Date());
      const formattedTime = format(parsedTime, 'h:mm a');

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${format(new Date(date), 'MMMM d, yyyy')}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${formattedTime}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            <p style="margin: 0; font-weight: 500;">${bookerName}</p>
            ${invitedPlayers.map(p => `<p style="margin: 4px 0 0 0; color: #64748b;">${p.name}</p>`).join('')}
          </td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isBooker ? 'Booking Confirmation' : 'Game Invitation'}</title>
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
                        ${isBooker ? 'Booking Confirmation' : 'Game Invitation'}
                      </h2>
                      
                      <p style="margin: 0 0 20px;">
                        Dear ${isBooker ? bookerName : playerName},
                      </p>
                      
                      <p style="margin: 0 0 30px;">
                        ${isBooker 
                          ? 'Your pickleball court booking has been confirmed.' 
                          : `You've been invited to a pickleball game by ${bookerName}.`}
                      </p>
                      
                      <!-- Booking Details -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Booking Details</h3>
                            <p style="margin: 0 0 10px;"><strong>Booking ID:</strong> ${bookingIds[0]}</p>
                            <p style="margin: 0 0 10px;"><strong>Court:</strong> ${courtName}</p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; border-spacing: 0; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; margin-top: 15px;">
                              <thead>
                                <tr style="background-color: #1e40af; color: #ffffff;">
                                  <th style="padding: 12px; text-align: left; font-weight: 500;">Date</th>
                                  <th style="padding: 12px; text-align: left; font-weight: 500;">Time</th>
                                  <th style="padding: 12px; text-align: left; font-weight: 500;">Players</th>
                                </tr>
                              </thead>
                              <tbody style="background-color: #ffffff;">
                                ${slotDetails}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Guidelines -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">General Santos Business Park Pickleball Guidelines</h3>
                            <ol style="margin: 0; padding-left: 20px; color: #475569;">
                              <li style="margin-bottom: 15px;">
                                <strong>Court Hours and Reservations</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Operating Hours: Open daily from 5:00 AM to 11:00 PM.</li>
                                  <li>Court Reservations: Courts can be reserved up to 48 hours in advance through our online booking system (pickleball.rdrealty.com.ph)</li>
                                  <li>Playing Duration: Each session is limited to confirmed booking hours.</li>
                                </ul>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <strong>Membership Structure and Fees</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Membership Fee: Php1,000.00 per year</li>
                                  <li>Payment Methods: We accept cash payment via GSBPPBC cashier.</li>
                                  <li>Refund Policy: Membership fees are non-refundable and non-transferrable.</li>
                                </ul>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <strong>Access to Courts</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Access Control: Members will receive membership ID or digital access code upon court entry.</li>
                                </ul>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <strong>Court Rules and Etiquette</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Attire: Non-marking shoes and appropriate sportswear are required.</li>
                                  <li>Behavior: All members are expected to demonstrate good sportsmanship and respect towards fellow players and staff. Offensive language or unsportsmanlike conduct will not be tolerated.</li>
                                  <li>Equipment: Members are encouraged to bring their own paddles and balls.</li>
                                  <li>Cleanup: Please remove personal belongings and trash upon leaving the court.</li>
                                </ul>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <strong>Safety and Maintenance</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Report Damage: Any court damage or maintenance issues must be reported to staff immediately.</li>
                                  <li>Injury Policy: Play at your own risk. GSBPPBC is not responsible for any injuries sustained during the activity.</li>
                                </ul>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <strong>Code of Conduct and Violation Penalties</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Conduct Guidelines: Members must adhere to the rules and show respect for all individuals using the court.</li>
                                  <li>Violations: Breaches of the guidelines may result in warnings, temporary suspension, or revocation of membership privileges.</li>
                                </ul>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <strong>Parking Area Policy</strong>
                                <ul style="margin-top: 5px;">
                                  <li>Parking at Your Own Risk. GSBPPBC is not responsible for any loss, theft, or damage to vehicles or their contents while parked on the premises.</li>
                                  <li>Parking is permitted for authorized users only.</li>
                                  <li>No Overnight Parking. Unauthorized vehicles left overnight is subject for Php5,000.00 penalty per night unless explicitly authorized in writing by management.</li>
                                </ul>
                              </li>
                            </ol>
                          </td>
                        </tr>
                      </table>

                      <!-- Contact Information -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e0f2fe; border-radius: 8px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Contact Information</h3>
                            <p style="margin: 0 0 10px;">For concerns or questions, please contact GSBPPBC:</p>
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

  // Send to booker
  await sendEmail({
    to: bookerEmail,
    subject: 'Your Pickleball Court Booking Confirmation',
    html: createEmailHTML(true)
  });

  // Send to invited players
  for (const player of invitedPlayers) {
    await sendEmail({
      to: player.email,
      subject: 'You\'ve Been Invited to a Pickleball Game',
      html: createEmailHTML(false, player.name)
    });
  }

  return { success: true };
}

