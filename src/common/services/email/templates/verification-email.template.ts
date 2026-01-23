export class VerificationEmailTemplate {
  static generate(verificationUrl: string, token: string): {
    subject: string;
    html: string;
    text: string;
  } {
    const fullUrl = `${verificationUrl}?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
            <h1 style="color: #2c3e50;">Verify Your Email Address</h1>
            <p>Thank you for registering with Health Hub. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${fullUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3498db;">${fullUrl}</p>
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `
Verify Your Email Address

Thank you for registering with Health Hub. Please verify your email address by visiting the following link:

${fullUrl}

This link will expire in 24 hours. If you didn't create an account, please ignore this email.
    `;

    return {
      subject: 'Verify Your Email Address - Health Hub',
      html: html.trim(),
      text: text.trim(),
    };
  }
}

