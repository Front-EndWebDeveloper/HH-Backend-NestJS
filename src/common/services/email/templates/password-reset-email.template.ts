export class PasswordResetEmailTemplate {
  static generate(
    passwordResetUrl: string,
    token: string,
  ): {
    subject: string;
    html: string;
    text: string;
  } {
    const fullUrl = `${passwordResetUrl}?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
            <h1 style="color: #2c3e50;">Reset Your Password</h1>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${fullUrl}" style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3498db;">${fullUrl}</p>
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `
Reset Your Password

You requested to reset your password. Visit the following link to create a new password:

${fullUrl}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
    `;

    return {
      subject: 'Reset Your Password - Health Hub',
      html: html.trim(),
      text: text.trim(),
    };
  }
}
