const 
  path = require('path'),
  webpack = require('webpack'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      test: path.resolve(__dirname, 'test')
    },    
    modules: [
      path.join(__dirname, 'src'), 
      path.resolve(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [{
      test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
      exclude: /(node_modules)/,
      use: ['file-loader']
    },{
      test: /\.(png|gif|jpg|svg)$/,
      use: ['file-loader']      
    },{
      test: /\.(js)$/,
      exclude: /(node_modules)/,
      use: ['babel-loader']
    },{
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]      
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Popper: ['popper.js', 'default']
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output both options are optional
//       filename: "[name].[chunkhash].css",
//       chunkFilename: "[name].[chunkhash].css"
      filename: '[name].bundle.css',
      chunkFilename: '[name].bundle.css',
    })
  ]  
};