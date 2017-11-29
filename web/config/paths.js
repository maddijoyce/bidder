const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const type = process.env.TYPE || 'app';
const appPath = path.join(appDirectory, type);
const publicPath = path.join(appPath, 'public');

module.exports = {
  appPath,
  publicPath,
  buildPath: path.join(appDirectory, 'build'),
  entryPath: path.join(appPath, 'index.js'),
  templatePath: path.join(publicPath, 'index.html'),
  appPackageJson: path.join(appDirectory, 'package.json'),
};
