export default () => ({
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Health Hub',
    verificationUrl: process.env.EMAIL_VERIFICATION_URL || 'http://localhost:3000/verify-email',
    passwordResetUrl: process.env.EMAIL_PASSWORD_RESET_URL || 'http://localhost:3000/reset-password',
  },
});

