const DEFAULT_ENVIRONMENT_ID = 'production';

class Builder {
  currentEnvironmentId = DEFAULT_ENVIRONMENT_ID;
  token = null;
  sessionId = null;

  init() {
    return new Promise((resolve, reject) => {
      if (!process.env.REACT_APP_ENV === 'production') {
        console.log('Instances UI', 'Development mode');
        resolve();
        return;
      }
      const timeout = setTimeout(resolve, 1000);
      window.addEventListener('message', e => {
        if (!e.data || e.data[0] !== 'init') return;
        const data = e.data[1];
        this.currentEnvironmentId = data.currentEnvironmentId;
        this.token = data.idToken;
        this.sessionId = data.sessionId;
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

  getSessionId() {
    return this.sessionId;
  }
}

const builder = new Builder();

export default builder;
