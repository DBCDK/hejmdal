export default {
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      platform: 'OS X 10.11',
      version: 'latest',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER
    },
    {
      maxInstances: 1,
      browserName: 'chrome',
      platform: 'Windows 10',
      version: 'latest',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER
    },
    {
      maxInstances: 1,
      browserName: 'firefox',
      platform: 'OS X 10.11',
      version: '47.0',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER,
      exclude: [
        './selenium/**/*.nonff.test.js' // excluded due to missing support for Storage and keys in Firefox selenium driver
      ]
    }
  ]
};
