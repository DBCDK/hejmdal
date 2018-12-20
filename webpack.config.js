const path = require('path');
const glob = require('glob');

module.exports = {
  entry: glob.sync('./src/client/*.js').reduce(function(obj, el) {
    obj[path.parse(el).name] = el;
    return obj;
  }, {}),
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {presets: ['@babel/env']}
      }
    ]
  },
  resolve: {extensions: ['*', '.js', '.jsx']},
  output: {
    path: path.resolve(__dirname, 'static/js/'),
    filename: '[name].js'
  }
};
