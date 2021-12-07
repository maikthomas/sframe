const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist_github'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'sframe',
  },
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: 'worker-loader',
        options: {
          inline: 'no-fallback',
          esModule: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
