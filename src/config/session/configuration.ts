export default () => ({
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10), // 24 hours
  },
});
