var babel = require('babel-core');

module.exports = function(wallaby) {
  return {
    files: [
      'package.json',
      'src/**/*.js',
      '!src/**/*.test.js'
    ],

    tests: [
      'src/**/*.test.js'
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: babel,
        plugins: [
          'transform-es2015-modules-commonjs',
          'transform-async-to-generator',
          'transform-class-properties'
        ]
      })
    },

    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: '' +
        'HASH_SHARED=12345;' +
        'MOCK_TICKET_STORAGE=memory;' +
        'MOCK_CONSENT_STORAGE=memory;' +
        'PORT=3011;' +
        'MOCK_CULR=1' // @see https://wallabyjs.com/docs/config/runner.html
      }
    },

    testFramework: 'mocha@2.1.0'
  };
};
