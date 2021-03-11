export function createInstanceInput(name, namespace, params) {
  const { labels } = params;

  return {
    apiVersion: 'servicecatalog.k8s.io/v1beta1',
    kind: 'ServiceInstance',
    metadata: {
      name,
      namespace,
      labels,
    },
  };
}
