const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist_github'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        resourceQuery: /inline/,
        type: 'asset/inline',
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
};
