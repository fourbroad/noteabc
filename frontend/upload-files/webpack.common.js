const 
  path = require('path'),
  webpack  = require('webpack'),
  CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      test: path.resolve(__dirname, 'test'),
      'jquery-ui/ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'canvas-to-blob': 'blueimp-canvas-to-blob/js/canvas-to-blob.js',
      'load-image': 'blueimp-load-image/js/load-image.js',
      'load-image-exif': 'blueimp-load-image/js/load-image-exif.js',
      'load-image-meta': 'blueimp-load-image/js/load-image-meta.js',
      'load-image-scale': 'blueimp-load-image/js/load-image-scale.js'
    },    
    modules: [
      path.join(__dirname, 'src'), 
      path.resolve(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [{
      test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
      use: ['file-loader']
    },{
      test: /\.(png|gif|jpg|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: 'assets'
        }
      }]      
    },{
      test: /\.(js)$/,
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output both options are optional
//       filename: "[name].[chunkhash].css",
//       chunkFilename: "[name].[chunkhash].css"
      filename: '[name].bundle.css',
      chunkFilename: '[name].bundle.css',
    })
  ]
};