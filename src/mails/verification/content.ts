export const verificationMailContent = (firstName: string, verificationLink: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
    </head>
    <body>
      <h2>Hello ${firstName},</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationLink}">Verify Email</a></p>
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Thank you!</p>
    </body>
    </html>
  `;
};
