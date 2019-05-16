import * as k8s from '@kubernetes/client-node';

import config from './../../config';
import { kubeConfig } from './../kubeconfig';

export class k8sApiService {
  constructor(
    namespaceName = config.testNamespace,
    definition,
    apiName = k8s.Core_v1Api,
  ) {
    const defaultDefinition = {
      metadata: {
        name: 'http-db-service',
        labels: {
          example: 'http-db-service',
        },
        annotations: {
          'auth.istio.io/8017': 'NONE',
        },
      },
      spec: {
        ports: [{ name: 'http', port: 5050 }],
        selector: {
          example: 'http-db-service',
        },
      },
    };

    this.definition = definition || defaultDefinition;
    this.api = kubeConfig.makeApiClient(apiName);
    this.namespaceName = namespaceName;

    this.create();
  }

  async create() {
    const resourceExists =
      (await this.api.listNamespacedService(
        this.namespaceName,
        undefined,
        undefined,
        undefined,
        'metadata.name=' + this.definition.metadata.name,
      )).response.body.items.length > 0;
    if (resourceExists) {
      console.info(
        `Service ${
          this.definition.metadata.name
        } already exists, but probably it shouldn't. Skipping creation`,
      );
      return;
    }
    await this.api.createNamespacedService(this.namespaceName, this.definition);
  }

  async delete() {
    await this.api.deleteNamespacedService(
      this.definition.metadata.name,
      this.namespaceName,
    );
  }
}
