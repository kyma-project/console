import * as k8s from '@kubernetes/client-node';
import config from '../config';
import { loadKubeConfig } from './kubeconfig';
import { NamespaceManager } from './namespace-manager';
import { HelmBrokerConfigurer } from './helm-broker/configurer';

export class TestBundleInstaller {
  constructor(namespace) {
    this.kubeConfig = loadKubeConfig();
    this.namespaceName = namespace;
    this.namespaceManager = new NamespaceManager(namespace);

    this.helmBrokerConfigurer = new HelmBrokerConfigurer();
  }

  async install() {
    console.log('Installing test bundle...');
    await this.namespaceManager.createIfDoesntExist();
    await this.helmBrokerConfigurer.includeTestBundleRepository();
    await this.helmBrokerConfigurer.waitForBrokerReady();
  }

  async cleanup() {
    console.log('Cleaning up test bundle...');
    await this.helmBrokerConfigurer.excludeTestBundleRepository();
    await this.helmBrokerConfigurer.waitForBrokerReady();
    await this.namespaceManager.delete();
  }
}
