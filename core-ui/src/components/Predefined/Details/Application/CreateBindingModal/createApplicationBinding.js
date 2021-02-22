export function createApplicationBinding(application, namespace, services) {
  return {
    apiVersion: 'applicationconnector.kyma-project.io/v1alpha1',
    kind: 'ApplicationMapping',
    metadata: {
      name: application.metadata.name,
      namespace,
    },
    spec: { services },
  };
}
