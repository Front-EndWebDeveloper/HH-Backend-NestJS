export default () => ({
  cache: {
    host: process.env.CACHE_HOST || 'localhost',
    port: parseInt(process.env.CACHE_PORT || '6379', 10),
    password: process.env.CACHE_PASSWORD || '',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
});

