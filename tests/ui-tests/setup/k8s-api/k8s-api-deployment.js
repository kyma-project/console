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

  async waitUntilCreated() {
    const timeoutPromise = (ms, rejectMsg) => {
      return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject(rejectMsg);
        }, ms);
      });
    };
    let deploymentReady = false;
    const waitUntilDeploymentReady = new Promise(resolve => {
      (async function isReady(api, namespace) {
        try {
          const response = await api.readNamespacedDeployment(
            'http-db-service',
            namespace,
          );
          deploymentReady =
            response &&
            response.body &&
            response.body.status &&
            response.body.status.availableReplicas &&
            response.body.status.availableReplicas > 0;
          if (deploymentReady) {
            resolve();
          } else {
            const timeoutId = setTimeout(() => {
              clearTimeout(timeoutId);
              isReady(api, namespace);
            }, 1000);
          }
        } catch (e) {
          const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            isReady(api, namespace);
          }, 1000);
        }
      })(this.api, this.namespaceName);
    });

    return Promise.race([
      waitUntilDeploymentReady,
      timeoutPromise(
        20000,
        `Waiting for deployment [http-db-service] ready state timed out after 20 s.'`,
      ),
    ]);
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
