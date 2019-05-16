import * as k8s from '@kubernetes/client-node';

import config from './../../config';
import { kubeConfig } from './../kubeconfig';

export class k8sApiDeployment {
  constructor(
    namespaceName = config.testNamespace,
    definition,
    apiName = k8s.Apps_v1Api,
  ) {
    const defaultDefinition = {
      metadata: {
        name: 'http-db-service',
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            example: 'http-db-service',
          },
        },
        template: {
          metadata: {
            labels: {
              example: 'http-db-service',
            },
            annotations: {
              'sidecar.istio.io/inject': 'true',
            },
          },
          spec: {
            imagePullSecrets: [{ name: 'kyma-docker-user' }],
            containers: [
              {
                image: 'vad1mo/hello-world-rest',
                imagePullPolicy: 'IfNotPresent',
                name: 'http-db-service',
                ports: [{ name: 'http', containerPort: 5050 }],
                env: [{ name: 'dbtype', value: 'memory' }],
              },
            ],
          },
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
      (await this.api.listNamespacedDeployment(
        this.namespaceName,
        undefined,
        undefined,
        undefined,
        'metadata.name=' + this.definition.metadata.name,
      )).response.body.items.length > 0;
    if (resourceExists) {
      console.info(
        `Deployment ${
          this.definition.metadata.name
        } already exists, but probably it shouldn't. Skipping creation`,
      );
      return;
    }
    await this.api.createNamespacedDeployment(
      this.namespaceName,
      this.definition,
    );
  }

  async delete() {
    await this.api.deleteNamespacedDeployment(
      this.definition.metadata.name,
      this.namespaceName,
    );
  }
}
