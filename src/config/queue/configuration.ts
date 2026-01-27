export default () => ({
  queue: {
    host: process.env.QUEUE_HOST || 'localhost',
    port: parseInt(process.env.QUEUE_PORT || '6379', 10),
    password: process.env.QUEUE_PASSWORD || '',
  },
});
