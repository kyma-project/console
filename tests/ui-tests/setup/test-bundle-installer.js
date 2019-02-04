import * as k8s from '@kubernetes/client-node';
import { loadKubeConfig } from './kubeconfig';
import { NamespaceManager } from './namespace-manager';
import { HelmBrokerConfigurer } from './helm-broker/configurer';

export class TestBundleInstaller {
  constructor(namespace) {
    const kubeConfig = loadKubeConfig();
    const coreApiClient = kubeConfig.makeApiClient(k8s.Core_v1Api);
    this.namespaceManager = new NamespaceManager(coreApiClient, namespace);

    const extensionsApiClient = kubeConfig.makeApiClient(
      k8s.Extensions_v1beta1Api
    );
    this.helmBrokerConfigurer = new HelmBrokerConfigurer(extensionsApiClient);
  }

  async install() {
    console.log('Installing test bundle...');
    await this.namespaceManager.createIfDoesntExist();
    await this.helmBrokerConfigurer.includeTestBundleRepository();
    await this.helmBrokerConfigurer.waitForBrokerReady();
    await this.helmBrokerConfigurer.waitForTestBundle();
  }

  async cleanup() {
    console.log('Cleaning up test bundle...');
    await this.helmBrokerConfigurer.excludeTestBundleRepository();
    await this.namespaceManager.deleteIfExists();
    await this.helmBrokerConfigurer.waitForBrokerReady();
  }
}
