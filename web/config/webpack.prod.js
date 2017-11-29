process.env.NODE_ENV = 'production';

const Merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CriticalPlugin } = require('@nrwl/webpack-plugin-critical');
const CommonConfig = require('./webpack.common');

const cssPosition = require('postcss-position');
const cssSimpleVars = require('postcss-simple-vars');
const cssColor = require('postcss-color-function');
const cssAutoprefixer = require('autoprefixer');
const cssVariables = require('./variables');

module.exports = Merge(CommonConfig, {
  devtool: 'source-map',
  entry: [
    require.resolve('./polyfills'),
    './index.js',
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: { importLoaders: 1, sourceMap: true, minimize: true },
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
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new UglifyJSPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        kee_fnames: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      comments: false,
    }),
    new CriticalPlugin({
      src: 'index.html',
      inline: true,
      minify: true,
      dest: 'index.html',
      include: [
        'svg',
        'label',
        'button',
      ],
    }),
  ],
});
