import { luigiClient } from './luigi';
import { BackendModules } from '../services/global/global.types';

interface InitializerReturnType {
  currentNamespace: string;
  backendModules: BackendModules[];
}

class AppInitializer {
  private token: string | null = '';

  init() {
    return new Promise<InitializerReturnType>((resolve, ) => {
      const timeout = setTimeout(() => {
        resolve({
          currentNamespace: "",
          backendModules: [],
        });
      }, 1000);

      luigiClient.addInitListener((context: luigiClient.Context) => {
        this.token = context.idToken;

        clearTimeout(timeout);
        resolve({
          currentNamespace: context.namespaceId,
          backendModules: context.backendModules,
          ...context,
        });
      });
    });
  }

  getBearerToken(): string | null {
    if (!this.token) {
      return null;
    }
    return `Bearer ${this.token}`;
  }
}

export const appInitializer = new AppInitializer();
