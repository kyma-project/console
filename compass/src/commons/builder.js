import LuigiClient from '@kyma-project/luigi-client';

class Builder {
  currentTenant = null;
  init() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 1000);

      LuigiClient.addInitListener(e => {
        this.currentTenant = e.tenantId;

        clearTimeout(timeout);
        resolve();
      });
    });
  }

  getTenant() {
    return this.currentTenant;
  }
}

const builder = new Builder();

export default builder;
