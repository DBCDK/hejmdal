export default {
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      platform: 'OS X 10.11',
      version: 'latest',
      'tunnel-identifier': process.env.TUNNEL_IDENTIFIER,
      build: process.env.BUILD_NUMBER
    }
  ],
  sauceConnect: true
};
