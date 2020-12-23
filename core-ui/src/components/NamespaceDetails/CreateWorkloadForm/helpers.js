export function formatDeployment(deployment) {
  if (!deployment.labels.app) {
    deployment.labels.app = deployment.name;
  }

  const runtimeDeployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: deployment.name,
      namespace: deployment.namespace,
      labels: deployment.labels,
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: deployment.labels },
      template: {
        metadata: { labels: deployment.labels },
        spec: {
          containers: [
            {
              name: deployment.name,
              image: deployment.dockerImage,
              resources: {
                requests: deployment.requests,
                limits: deployment.limits,
              },
            },
          ],
        },
      },
    },
  };
  return runtimeDeployment;
}

export function formatService(deployment, deploymentUID) {
  if (!deployment.labels.app) {
    deployment.labels.app = deployment.name;
  }

  const service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: deployment.name,
      namespace: deployment.namespace,
      ownerReferences: [
        {
          kind: 'Deployment',
          apiVersion: 'apps/v1',
          name: deployment.name,
          uid: deploymentUID,
        },
      ],
    },
    spec: {
      type: 'ClusterIP',
      ports: [
        {
          name: 'http',
          port: deployment.port.port,
          protocol: 'TCP',
          targetPort: deployment.port.targetPort,
        },
      ],
    },
  };
  return service;
}
