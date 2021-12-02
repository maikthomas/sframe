const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist_github'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'sframe',
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
      // {
        // test: /\.worker\.js$/,
        // use: {
        //   loader: 'worker-loader',
        //   options: {
        //     inline: 'no-fallback',
        //   },
        // },
        {
          test: /\.worker\.js$/i,
          loader: "worker-loader",
          options: {
            esModule: false,
            inline: 'no-fallback',
          },
        },
      // },
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
};
