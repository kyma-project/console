import config from '../config';

class Console {
  getConsole() {
    return config.localdev
      ? config.devConsoleUrl
      : 'https://console.' + config.domain;
  }

  getEnvironment(environment) {
    return this.getConsole() + '/home/namespaces/' + environment;
  }

  getRemoteEnvironments() {
    return this.getConsole() + '/home/apps';
  }

  getEnvironmentsAddress() {
    return this.getConsole() + '/home/workspace';
  }

  getCatalog(environment) {
    return this.getEnvironment(environment) + '/service-catalog';
  }

  getInstancesList(environment) {
    return this.getEnvironment(environment) + '/instances';
  }

  getInstance(environment, instanceName) {
    return this.getInstancesList(environment) + '/details/' + instanceName;
  }

  getDocs() {
    return this.getConsole() + '/docs';
  }
}

class API {
  getAPI() {
    return 'https://apiserver.' + config.domain;
  }

  getNamespace(environment) {
    return this.getAPI() + '/api/v1/namespaces/' + environment;
  }
}

class Dex {
  getDex() {
    return 'https://dex.' + config.domain;
  }

  getOpenID() {
    return this.getDex() + '/.well-known/openid-configuration';
  }
}

module.exports = {
  console: new Console(),
  api: new API(),
  dex: new Dex()
};
