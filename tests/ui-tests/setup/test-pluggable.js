import * as k8s from '@kubernetes/client-node';
import { kubeConfig } from './kubeconfig';

class BackendModuleFetcher {
  constructor() {
    this.modules = [];
    this.fetched = false;
  }

  async fetchIfShould() {
    if (this.fetched) {
      return;
    }

    await this.fetch();
  }

  async fetch() {
    const apiClient = kubeConfig.makeApiClient(k8s.Custom_objectsApi);
    const { body } = await apiClient.listClusterCustomObject(
      'ui.kyma-project.io',
      'v1alpha1',
      'backendmodules',
    );
    const items = body.items.map(item => item.metadata.name);
    this.modules = items;
    this.fetched = true;
  }

  isModuleEnabled(moduleName) {
    if (!this.fetched) {
      throw new Error('Fetch all modules first');
    }

    return this.modules.includes(moduleName);
  }
}

const moduleFetcher = new BackendModuleFetcher();

export const testPluggable = (requiredModule, name, fn) => {
  return test(name, async () => {
    await moduleFetcher.fetchIfShould();

    if (!moduleFetcher.isModuleEnabled(requiredModule)) {
      return () => {
        console.log(
          `Module ${requiredModule} is disabled. Skipping test ${name}...`,
        );
      };
    }

    return fn();
  });
};

export const isModuleEnabled = async requiredModule => {
  await moduleFetcher.fetchIfShould();
  return moduleFetcher.isModuleEnabled(requiredModule);
};

export const logModuleDisabled = (requiredModule, fnName) => {
  console.log(
    `Skipping '${fnName}' because of disabled module ${requiredModule}`,
  );
};
