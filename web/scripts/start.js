/* eslint-disable no-console */
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const { protocol, host, port, config } = require('../config/webpack.dev');
const { publicPath } = require('../config/paths');
const formatMessages = require('./formatMessages');

const isInteractive = process.stdout.isTTY;

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

const compiler = webpack(config);
let isFirstCompile = true;
compiler.plugin('invalid', function() {
  if (isInteractive) clearConsole();
  console.log('Compiling...');
});
compiler.plugin('done', function(stats) {
  if (isInteractive) clearConsole();
  const messages = formatMessages(stats.toJson({}, true));
  const isSuccessful = !messages.errors.length && !messages.warnings.length;
  const showInstructions = isSuccessful && (isInteractive || isFirstCompile);

  if (isSuccessful) console.log(chalk.green('Compiled Successfully.'));
  if (showInstructions) {
    console.log('\nThe app is running at:');
    console.log('  ' + chalk.cyan(protocol + '://' + host + ':' + port + '/\n'));
    isFirstCompile = false;
  }
  if (messages.errors.length) {
    console.log(chalk.red('Failed to compile.\n'));
    messages.errors.forEach(message => {
      console.log(message + '\n');
    });
  }
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    messages.warnings.forEach(message => {
      console.log(message + '\n');
    });
  }
});

var devServer = new WebpackDevServer(compiler, {
  clientLogLevel: 'none',
  compress: true,
  contentBase: publicPath,
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true,
  overlay: true,
  quiet: true,
  watchOptions: { ignored: /node_modules/ },
  https: (protocol === 'https'),
  host: host,
});

devServer.listen(port, err => {
  if (err) console.log(err);

  if (isInteractive) clearConsole();
  console.log(chalk.cyan('Starting the development server...\n'));
});
