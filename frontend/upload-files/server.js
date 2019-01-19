const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.development.js');
const compiler = webpack(config);

var routes = require('./routes');

const app = express();

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(express.static('.'));

app.use("/", routes);

app.listen(8089, function() {
  console.log('Example app listening on port 8089!');
});
