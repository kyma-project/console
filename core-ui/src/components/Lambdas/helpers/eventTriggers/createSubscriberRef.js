import { TRIGGER_SUBSCRIBER } from '../../constants';

export function createSubscriberRef(lambda = {}) {
  return {
    ref: {
      apiVersion: TRIGGER_SUBSCRIBER.SERVING_API_VERSION,
      kind: TRIGGER_SUBSCRIBER.SERVING_SERVICE,
      name: lambda.name || '',
      namespace: lambda.namespace || '',
    },
  };
}
