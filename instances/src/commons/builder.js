import LuigiClient from '@kyma-project/luigi-client';

const DEFAULT_ENVIRONMENT_ID = 'production';

class Builder {
  currentEnvironmentId = DEFAULT_ENVIRONMENT_ID;
  token = null;

  init() {
    return new Promise((resolve, reject) => {
      if (!process.env.REACT_APP_ENV === 'production') {
        console.log('Instances UI', 'Development mode');
        resolve();
        return;
      }
      const timeout = setTimeout(resolve, 1000);
      LuigiClient.addInitListener(e => {
        this.currentEnvironmentId = e.environmentId;
        this.token = e.idToken;
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
}

const builder = new Builder();

export default builder;
