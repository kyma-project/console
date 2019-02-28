import * as k8s from '@kubernetes/client-node';
import { kubeConfig } from './kubeconfig';
import { NamespaceManager } from './namespace-manager';
import { HelmBrokerConfigurer } from './helm-broker/configurer';

export class TestBundleInstaller {
  constructor(namespace) {
    const coreApiClient = kubeConfig.makeApiClient(k8s.Core_v1Api);
    this.namespaceManager = new NamespaceManager(coreApiClient, namespace);
    this.helmBrokerConfigurer = new HelmBrokerConfigurer({
      kubeConfig,
      apiClient: coreApiClient
    });
  }

  async install() {
    console.log('Installing test bundle...');
    await this.namespaceManager.createIfDoesntExist();
    await this.helmBrokerConfigurer.includeTestBundleRepository();
    await this.helmBrokerConfigurer.waitForTestBundle();
    await this.helmBrokerConfigurer.waitForTestPlans();
  }

  async cleanup() {
    console.log('Cleaning up test bundle...');
    await this.helmBrokerConfigurer.excludeTestBundleRepository();
    await this.namespaceManager.deleteIfExists();
  }
}
