import * as k8s from '@kubernetes/client-node';
import config from '../config';
import { loadKubeConfig } from './kubeconfig';
import { NamespaceManager } from './namespace-manager';

export class TestBundleInstaller {
  constructor(namespace) {
    this.kubeConfig = loadKubeConfig();
    this.namespaceName = namespace;
    this.namespaceManager = new NamespaceManager(namespace);
  }

  async install() {
    console.log('Installing test bundle...');
    // create ns
    await this.namespaceManager.createIfDoesntExist();

    // add repository to HB
    // wait for HB deployment ready
    // bump relistRequests for ClusterServiceBroker
  }

  async cleanup() {
    console.log('Cleaning up test bundle...');
    // unregister HB repository
    // bump relistRequests for ClusterServiceBroker
    // wait for HB deploy ready
    // delete ns
    await this.namespaceManager.delete();
  }
}
