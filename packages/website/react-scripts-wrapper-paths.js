// https://github.com/facebook/create-react-app/issues/1354

const paths = require('react-scripts/config/paths');
const path = require('path');

// Change 'dist' here to whatever build directory you need.
paths.appBuild = path.resolve(paths.appPath, 'dist');

module.exports = paths;
