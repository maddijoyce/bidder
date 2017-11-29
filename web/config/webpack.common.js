const { EnvironmentPlugin, NamedModulesPlugin, HotModuleReplacementPlugin } = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { appPath, buildPath, templatePath } = require('./paths');
const publicPath = '/';

module.exports = {
  context: appPath,
  output: {
    filename: 'main.js',
    path: buildPath,
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        exclude: /\.(html|js|graphql|gql|css|json|svg|woff)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 10000, name: 'static/media/[name].[hash:8].[ext]' },
        }],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: ['graphql-tag/loader'],
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', 'react-svg-loader'],
      },
      {
        test: /\.woff$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 65000, name: 'static/media/[name].[hash:8].[ext]' },
        }],
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin([
      'NODE_ENV',
      'GRAPHQL',
      'WS',
    ]),
    new FaviconsWebpackPlugin({
      logo: '../components/images/logo.png',
      persistentCache: true,
      inject: true,
      background: '#fff',
      title: 'Bidder',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: templatePath,
    }),
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
  ],
};
