import LuigiClient from '@kyma-project/luigi-client';
const uuidv5 = require('uuid/v5');
var validate = require('uuid-validate');
const NAMESPACE = '1b671a64-babe-b00b-face-da01ff1f3341';

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
    if(validate(this.currentTenant)){
      return this.currentTenant;
    }
    return uuidv5(this.currentTenant, NAMESPACE);
  }
}

const builder = new Builder();

export default builder;
