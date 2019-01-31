import * as k8s from '@kubernetes/client-node';
import { loadKubeConfig } from '../kubeconfig';
import { helmBrokerConfig } from './config';

export class HelmBrokerConfigurer {
  constructor() {
    this.kubeConfig = loadKubeConfig();
    this.api = this.kubeConfig.makeApiClient(k8s.Extensions_v1beta1Api);
  }

  async includeTestBundleRepository() {
    console.log('Including test bundle repository for Helm Broker...');
    return await this.mutateReposEnv(
      currentValue =>
        currentValue.concat(
          `${helmBrokerConfig.repositoriesSeparator}${
            helmBrokerConfig.testBundleUrl
          }`
        ),
      true
    );
  }

  async excludeTestBundleRepository() {
    console.log('Excluding test bundle repository for Helm Broker...');
    return await this.mutateReposEnv(
      currentValue =>
        currentValue.replace(
          `${helmBrokerConfig.repositoriesSeparator}${
            helmBrokerConfig.testBundleUrl
          }`,
          ''
        ),
      false
    );
  }

  async waitForBrokerReady() {
    console.log('Waiting for ready Helm Broker deployment...');
    return this.watch(
      `/apis/extensions/v1beta1/namespaces/${
        helmBrokerConfig.namespace
      }/deployments`,
      { fieldSelector: `metadata.name=${helmBrokerConfig.name}` },
      (resolve, reject) => (type, obj) => {
        if (type === 'DELETED') {
          return;
        }

        if (obj.status.replicas === 1 && obj.status.readyReplicas === 1) {
          console.log('Helm Broker deployment is ready.');
          resolve(obj);
        }
      },
      (resolve, reject) => err => {
        reject(err);
      },
      'broker'
    );
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
      const req = watch.watch(
        path,
        queryParams,
        callbackFn(resolve, reject),
        doneFn(resolve, reject)
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

  isTestBundleRepoIncluded(helmBrokerDeployment) {
    const envs = helmBrokerDeployment.spec.template.spec.containers[0].env;

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

    return repositoriesEnv.value.search(helmBrokerConfig.testBundleUrl) > 0;
  }

  async mutateReposEnv(mutateFn, skipIfExists) {
    const { body } = await this.api.readNamespacedDeployment(
      helmBrokerConfig.name,
      helmBrokerConfig.namespace
    );

    if (this.isTestBundleRepoIncluded(body) && skipIfExists) {
      console.log(
        'Repository with test bundle already included in helm broker repositories. Skipping...'
      );
      return;
    }

    const envs = body.spec.template.spec.containers[0].env;

    const repositoriesEnvIndex = envs.findIndex(
      e => e.name === helmBrokerConfig.repositoriesEnvName
    );

    if (!repositoriesEnvIndex) {
      throw new Error(
        `Cannot find env ${helmBrokerConfig.repositoriesEnvName} in ${
          helmBrokerConfig.namespace
        }/${helmBrokerConfig.name} deployment`
      );
    }

    const currentReposEnvValue =
      body.spec.template.spec.containers[0].env[repositoriesEnvIndex].value;

    body.spec.template.spec.containers[0].env[
      repositoriesEnvIndex
    ].value = mutateFn(currentReposEnvValue);

    await this.api.replaceNamespacedDeployment(
      helmBrokerConfig.name,
      helmBrokerConfig.namespace,
      body
    );
  }
}
