const webpack = require('webpack');

module.exports = {

  rules: [
    {
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
    },
  
  ],
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ]
};
