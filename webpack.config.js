const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist_github'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      // {
      //   test: /Worker\.js$/,
      //   use: {
      //     loader: 'worker-loader',
      //     options: {
      //       inline: 'fallback',
      //     },
      //   },
      // },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: 'fallback',
          },
        },
      },
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
};
