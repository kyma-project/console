import LuigiClient from '@kyma-project/luigi-client';

const DEFAULT_ENVIRONMENT_ID = 'production';

class Builder {
  currentEnvironmentId = DEFAULT_ENVIRONMENT_ID;
  token = null;
  backendModules = [];

  initOrContextUpdate(callback) {
    LuigiClient.addInitListener(e => {
      this.setCurrentContext(e);
      callback();
    });

    LuigiClient.addContextUpdateListener(e => {
      if (!e.namespaceId) {
        return;
      }
      if (e.namespaceId !== this.currentEnvironmentId) {
        this.setCurrentContext(e);
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .navigate('cmf-instances');
        return callback();
      }
      this.setCurrentContext(e);
    });
  }

  setCurrentContext(ctx) {
    this.currentEnvironmentId = ctx.namespaceId;
    this.token = ctx.idToken;
    this.backendModules = ctx.backendModules;
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
