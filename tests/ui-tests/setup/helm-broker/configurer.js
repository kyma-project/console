import * as k8s from '@kubernetes/client-node';
import { helmBrokerConfig } from './config';

export class HelmBrokerConfigurer {
  constructor(namespace, kubeConfig, apiClient) {
    this.namespaceName = namespace;
    this.kubeConfig = kubeConfig;
    this.api = apiClient;
    this.mapName = 'ui-test-bundles-repo';
  }

  async includeTestBundleRepository() {
    console.log('Including test bundle repository for Helm Broker...');

    await this.api.createNamespacedConfigMap(this.namespaceName, {
      metadata: {
        name: this.mapName,
        labels: { repo: 'true' }
      },
      data: { URLs: helmBrokerConfig.testBundleUrl }
    });
  }

  async excludeTestBundleRepository() {
    console.log('Excluding test bundle repository for Helm Broker...');
    await this.api.deleteNamespacedConfigMap(this.mapName, this.namespaceName);
  }

  async waitForTestBundle() {
    console.log('Waiting for ready test bundle...');
    return this.watch(
      `/apis/servicecatalog.k8s.io/v1beta1/clusterserviceclasses`,
      {},
      (resolve, reject) => (type, obj) => {
        if (type === 'DELETED') {
          return;
        }

        if (obj.spec.externalName === helmBrokerConfig.testBundleExternalName) {
          console.log('Test bundle is available.');
          console.log(obj);
          resolve(obj);
        }
      },
      (resolve, reject) => err => {
        reject(err);
      },
      'test bundle'
    );
  }

  async watch(path, queryParams, callbackFn, doneFn, name) {
    const watch = new k8s.Watch(this.kubeConfig);

    const promise = new Promise((resolve, reject) => {
      let req;

      const resolveFn = x => {
        if (req) {
          req.abort();
        }
        resolve(x);
      };

      req = watch.watch(
        path,
        queryParams,
        callbackFn(resolveFn, reject),
        doneFn(resolveFn, reject)
      );

      setTimeout(() => {
        if (req) {
          req.abort();
        }
        reject(new Error(`Watch for ready ${name} timed out`));
      }, helmBrokerConfig.readyTimeout);
    });

    return promise;
  }
}
