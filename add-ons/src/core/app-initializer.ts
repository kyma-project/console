import LuigiClient from '@kyma-project/luigi-client';
import { BackendModule } from '../types';

const DEFAULT_ENVIRONMENT_ID = 'production';

class AppInitializer {
  currentEnvironmentId: string = DEFAULT_ENVIRONMENT_ID;
  token: string | null = '';
  backendModules: BackendModule[] = [];

  init() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 1000);

      LuigiClient.addInitListener((e: any) => {
        this.currentEnvironmentId = e.namespaceId;
        this.token = e.idToken;
        this.backendModules = e.backendModules;

        clearTimeout(timeout);
        resolve();
      });
    });
  }

  getBearerToken(): string | null {
    if (!this.token) {
      return null;
    }
    return `Bearer ${this.token}`;
  }

  getCurrentEnvironmentId(): string {
    return this.currentEnvironmentId;
  }

  getBackendModules(): BackendModule[] {
    return this.backendModules;
  }

  backendModuleExists = (name: string) => {
    return this.backendModules.includes(name);
  };
}

export default new AppInitializer();
