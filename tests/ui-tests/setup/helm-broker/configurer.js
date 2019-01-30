import * as k8s from '@kubernetes/client-node';
import { loadKubeConfig } from '../kubeconfig';
import { helmBrokerConfig } from './config';

export class HelmBrokerConfigurer {
  constructor() {
    this.kubeConfig = loadKubeConfig();
    this.api = this.kubeConfig.makeApiClient(k8s.Extensions_v1beta1Api);
  }

  async includeTestBundleRepository() {
    const { body } = await this.api.readNamespacedDeployment(
      helmBrokerConfig.name,
      helmBrokerConfig.namespace
    );
    const containers = body.spec.template.spec.containers;
    const container = containers[0];
    const envs = container.env;

    const repositoriesEnv = envs.find(
      e => e.name === helmBrokerConfig.repositoriesEnvName
    );

    if (!repositoriesEnv) {
      throw new Error(
        `Cannot find env ${helmBrokerConfig.repositoriesEnvName} in ${
          helmBrokerConfig.namespace
        }/${helmBrokerConfig.name} deployment`
      );
    }

    if (repositoriesEnv.value.search(helmBrokerConfig.testBundleUrl) !== -1) {
      console.log(
        'Repository with test bundle already included in helm broker repositories'
      );
      return;
    }

    const newEnvValue = repositoriesEnv.value.concat(
      `${helmBrokerConfig.repositoriesSeparator}${
        helmBrokerConfig.testBundleUrl
      }`
    );

    try {
      await this.api.patchNamespacedDeployment(
        helmBrokerConfig.name,
        helmBrokerConfig.namespace,
        {
          spec: {
            template: {
              spec: {
                containers
              }
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async excludeTestBundleRepository() {}

  async waitForBrokerReady() {
    const watch = new k8s.Watch(this.kubeConfig);

    let req;
    const promise = new Promise((resolve, reject) => {
      req = watch.watch(
        `/apis/extensions/v1beta1/namespaces/${
          helmBrokerConfig.namespace
        }/deployments`,
        {
          fieldSelector: `metadata.name=${helmBrokerConfig.name}`
        },
        (type, obj) => {
          if (type !== 'MODIFIED') {
            return;
          }

          if (obj.status.replicas === 1 && obj.status.readyReplicas === 1) {
            resolve(obj);
          }
        },
        err => {
          reject(err);
        }
      );
    });

    setTimeout(() => {
      if (!req) {
        return;
      }

      req.abort();
    }, 120 * 1000);
    return promise;
  }
}
