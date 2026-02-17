export default () => {
  const backendUrl = process.env.HHBACKEND_URL || '';

  // Callback is handled by a raw Fastify route (no API prefix) in main.ts
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    (backendUrl ? `${backendUrl}/accounts/google/login/callback` : '');

  return {
    googleOAuth: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL,
      enabled: process.env.GOOGLE_OAUTH_ENABLED !== 'false',
    },
  };
};

