import config from '../config';

// Console

function getConsole() {
  return config.localdev
    ? config.devConsoleUrl
    : 'https://console.' + config.domain;
}

function getEnvironment(environment) {
  return getConsole() + '/home/environments/' + environment;
}

function getCatalog(environment) {
  return getEnvironment(environment) + '/service-catalog';
}

function getInstancesList(environment) {
  return getEnvironment(environment) + '/instances';
}

function getInstance(environment, instanceName) {
  return getInstancesList(environment) + '/details/' + instanceName;
}

function getDocs() {
  return getConsole() + '/home/docs';
}

// API

function getAPI() {
  return 'https://apiserver.' + config.domain;
}

function getNamespaceAPI(environment) {
  return getAPI() + '/api/v1/namespaces/' + environment;
}

// Dex

function getDex() {
  return 'https://dex.' + config.domain;
}

function getOpenID() {
  return getDex() + '/.well-known/openid-configuration';
}

module.exports = {
  getConsole,
  getCatalog,
  getInstancesList,
  getInstance,
  getDocs,
  getNamespaceAPI,
  getOpenID
};
