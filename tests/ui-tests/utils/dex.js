import config from '../config';
const fs = require('fs');

function isStaticUser() {
  return !(
    fs.existsSync(config.dexConfig) &&
    findInFile(config.dexConfig, 'connectors:')
  );
}

function findInFile(path, value) {
  const data = fs.readFileSync(path);
  return data.indexOf(value) >= 0;
}

module.exports = {
  isStaticUser,
};
