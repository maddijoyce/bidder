require('dotenv').config();

process.env.NODE_ENV = 'development';
const protocol = process.env.HTTPS === 'true' ? "https" : "http";
const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 8061;

const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common');

const cssPosition = require('postcss-position');
const cssSimpleVars = require('postcss-simple-vars');
const cssColor = require('postcss-color-function');
const cssAutoprefixer = require('autoprefixer');
const cssVariables = require('./variables');

module.exports = {
  protocol: protocol,
  host: host,
  port: port,
  config: Merge(CommonConfig, {
    devtool: 'cheap-module-source-map',
    entry: [
      require.resolve('./polyfills'),
      'react-hot-loader/patch',
      'webpack-dev-server/client?' + protocol + '://' + host + ':' + port,
      'webpack/hot/only-dev-server',
      './index.js',
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['react-hot-loader/webpack', 'babel-loader'],
        },
        {
          test: /\.css$/,
          use: [{
            loader: 'style-loader',
            options: { sourceMap: true },
          }, {
            loader: 'css-loader',
            options: { importLoaders: 1, sourceMap: true },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  cssPosition,
                  cssSimpleVars({ variables: cssVariables }),
                  cssColor(),
                  cssAutoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                  }),
                ];
              },
            },
          }],
        },
      ],
    },
  }),
};
