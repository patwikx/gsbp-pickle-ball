import React from 'react';

interface RegistrationConfirmationEmailProps {
  name: string;
  email: string;
  registrationId: string;
}

export const RegistrationConfirmationEmail: React.FC<RegistrationConfirmationEmailProps> = ({
  name,
  email,
  registrationId
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registration Confirmation</title>
        <style>{`
          body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.5;
            color: #1e293b;
            background-color: #f1f5f9;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </head>
      <body>
        <table border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ tableLayout: 'fixed' }}>
          <tr>
            <td align="center" style={{ padding: '40px 0' }}>
              <table border={0} cellPadding="0" cellSpacing="0" width="600" style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                {/* Header */}
                <tr>
                  <td style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '40px 0', textAlign: 'center' }}>
                    <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 700, margin: 0 }}>General Santos Business Park</h1>
                    <p style={{ color: '#e0f2fe', fontSize: '18px', margin: '10px 0 0' }}>Pickleball Court Booking System</p>
                  </td>
                </tr>
                
                {/* Content */}
                <tr>
                  <td style={{ padding: '40px 30px' }}>
                    <h2 style={{ color: '#1e40af', fontSize: '24px', fontWeight: 600, margin: '0 0 20px' }}>
                      Registration Confirmation
                    </h2>
                    
                    <p style={{ margin: '0 0 20px' }}>
                      Dear {name},
                    </p>
                    
                    <p style={{ margin: '0 0 30px' }}>
                      Thank you for registering with the General Santos Business Park Pickleball Court Booking System. Your account has been successfully created.
                    </p>
                    
                    {/* Registration Details */}
                    <table border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <h3 style={{ color: '#1e40af', fontSize: '18px', fontWeight: 600, margin: '0 0 15px' }}>Registration Details</h3>
                          <p style={{ margin: '0 0 10px' }}><strong>Registration ID:</strong> {registrationId}</p>
                          <p style={{ margin: '0 0 10px' }}><strong>Name:</strong> {name}</p>
                          <p style={{ margin: '0 0 10px' }}><strong>Email:</strong> {email}</p>
                        </td>
                      </tr>
                    </table>

                    {/* Next Steps */}
                    <table border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <h3 style={{ color: '#1e40af', fontSize: '18px', fontWeight: 600, margin: '0 0 15px' }}>Next Steps</h3>
                          <ol style={{ margin: '0', paddingLeft: '20px', color: '#475569' }}>
                          <li style={{ marginBottom: '10px' }}>Go to the RD Realty Development Corporation office cashier.</li>
                          <li style={{ marginBottom: '10px' }}>Present your registration ID and your name to the cashier.</li>
                          <li style={{ marginBottom: '10px' }}>Pay the account activation fee of 1000 PHP.</li>
                          <li style={{ marginBottom: '10px' }}>Your account will be activated after payment confirmation.</li>
                            <li style={{ marginBottom: '10px' }}>Log in to your account using your registered email and password.</li>
                            <li style={{ marginBottom: '10px' }}>Complete your profile by adding any additional required information.</li>
                            <li style={{ marginBottom: '10px' }}>Familiarize yourself with our booking system and court guidelines.</li>
                            <li style={{ marginBottom: '10px' }}>Start booking your preferred pickleball court slots!</li>
                          </ol>
                        </td>
                      </tr>
                    </table>

                    {/* Contact Information */}
                    <table border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ backgroundColor: '#e0f2fe', borderRadius: '8px', overflow: 'hidden' }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <h3 style={{ color: '#1e40af', fontSize: '18px', fontWeight: 600, margin: '0 0 15px' }}>Contact Information</h3>
                          <p style={{ margin: '0 0 10px' }}>For any questions or concerns, please contact GSBPPBC:</p>
                          <p style={{ margin: '0 0 5px' }}>Email: <a href="mailto:pmd.associate@rdretailgroup.com.ph" style={{ color: '#2563eb', textDecoration: 'none' }}>pmd.associate@rdretailgroup.com.ph</a></p>
                          <p style={{ margin: '0' }}>Phone: <a href="tel:+639992202427" style={{ color: '#2563eb', textDecoration: 'none' }}>+63 999 220 2427</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: '#1e40af', color: '#ffffff', padding: '30px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 10px', fontSize: '14px' }}>This is an automated message from the GSBP Pickleball Court Booking System</p>
                    <p style={{ margin: '0', fontSize: '14px' }}>&copy; 2024 General Santos Business Park. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

