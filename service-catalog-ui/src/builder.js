import LuigiClient from '@luigi-project/client';

const DEFAULT_ENVIRONMENT_ID = 'production';

class Builder {
  currentEnvironmentId = DEFAULT_ENVIRONMENT_ID;
  token = null;
  backendModules = [];

  addEventListeners(callback) {
    const eventId = LuigiClient.addInitListener(e => {
      this.setCurrentContext(e);
      callback();
      LuigiClient.removeInitListener(eventId);
    });

    LuigiClient.addContextUpdateListener(e => {
      if (!e.namespaceId) {
        return;
      }
      if (e.namespaceId !== this.currentEnvironmentId) {
        this.setCurrentContext(e);
        callback();
      }
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
