process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');

const checkRequiredFiles = require('./checkRequiredFiles');
const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require('./fileSizeReporter');
const formatMessages = require('./formatMessages');
const { publicPath, buildPath, entryPath, templatePath } = require('../config/paths');
const config = require('../config/webpack.prod');

const BUNDLE_SIZE_WARN = 512 * 1024;
const CHUNK_SIZE_WARN = 1024 * 1024;

if (!checkRequiredFiles([entryPath, templatePath])) {
  process.exit(1);
}

measureFileSizesBeforeBuild(buildPath)
.then(previousFileSizes => {
  fs.emptyDirSync(buildPath);
  copyPublicFolder();
  return build(previousFileSizes);
})
.then(({ stats, previousFileSizes, warnings }) => {
  if (warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(warnings.join('\n'));
  } else {
    console.log(chalk.green('Compiled successfully.\n'));
  }

  console.log('File sizes after gzip:');
  printFileSizesAfterBuild(stats, previousFileSizes, buildPath, BUNDLE_SIZE_WARN, CHUNK_SIZE_WARN);
}, e => {
  console.log(chalk.red('Failed to compile.\n'));
  console.log((e.message || e) + '\n');
  process.exit(1);
});

function build(previousFileSizes) {
  console.log('Generating optimized production build...');
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((e, stats) => {
      if (e) {
        reject(e);
      } else {
        const messages = formatMessages(stats.toJson({}, true));
        if (messages.errors.length) {
          reject(new Error(messages.errors.join('\n')));
        } else {
          resolve({
            stats,
            previousFileSizes,
            warnings: messages.warnings,
          });
        }
      }
    });
  });
}

function copyPublicFolder() {
  fs.copySync(publicPath, buildPath, {
    dereference: true,
    filter: file => file !== templatePath,
  });
}
