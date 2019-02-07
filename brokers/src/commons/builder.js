import LuigiClient from '@kyma-project/luigi-client';

const DEFAULT_ENVIRONMENT_ID = 'production';

class Builder {
  currentEnvironmentId = DEFAULT_ENVIRONMENT_ID;
  token = null;
  backendModules = [];

  init() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 1000);

      LuigiClient.addInitListener(e => {
        this.currentEnvironmentId = e.environmentId;
        this.token = e.idToken;
        this.backendModules = e.backendModules;
        
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  getBearerToken() {
    if (!this.token) {
      return null;
    }
    return `Bearer ${this.token}`;
  }

  getCurrentEnvironmentId() {
    return this.currentEnvironmentId;
  }

  getBackendModules() {
    return this.backendModules;
  }
}

const builder = new Builder();

export default builder;
