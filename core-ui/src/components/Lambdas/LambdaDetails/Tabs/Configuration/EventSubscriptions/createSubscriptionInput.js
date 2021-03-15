export function createSubscriptionInput(
  name,
  lambda,
  ownerRef,
  sink,
  eventType,
) {
  return {
    apiVersion: 'eventing.kyma-project.io/v1alpha1',
    kind: 'Subscription',
    metadata: {
      name,
      namespace: lambda.metadata.namespace,
      ownerReferences: [ownerRef],
    },
    spec: {
      protocol: '',
      protocolsettings: {},
      sink,
      filter: {
        filters: [
          {
            eventSource: { property: 'source', type: 'exact', value: '' },
            eventType: {
              property: 'type',
              type: 'exact',
              value: eventType,
            },
          },
        ],
      },
    },
  };
}
