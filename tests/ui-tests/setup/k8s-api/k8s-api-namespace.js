import * as k8s from '@kubernetes/client-node';

import config from './../../config';
import { kubeConfig } from './../kubeconfig';

export class k8sApiNamespace {
  constructor(namespace, definition, apiName = k8s.Core_v1Api) {
    const defaultDefinition = {
      metadata: {
        name: namespace || config.testNamespace,
        labels: { env: 'true' },
      },
    };
    this.definition = definition || defaultDefinition;
    this.api = kubeConfig.makeApiClient(apiName);
    this.create();
  }

  async create() {
    const resourceExists =
      (await this.api.listNamespace(
        undefined,
        undefined,
        undefined,
        'metadata.name=' + this.definition.metadata.name,
      )).response.body.items.length > 0;
    if (resourceExists) {
      console.info(
        `Namespace ${
          this.definition.metadata.name
        } already exists, but probably it shouldn't. Skipping creation`,
      );
      return;
    }
    await this.api.createNamespace(this.definition);
  }

  async delete() {
    await this.api.deleteNamespace(this.definition.metadata.name);
  }
}
