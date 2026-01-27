export default () => ({
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || 'v1/api',
  },
});
