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
      runner: 'node'
    },

    testFramework: 'mocha@2.1.0'
  };
};
