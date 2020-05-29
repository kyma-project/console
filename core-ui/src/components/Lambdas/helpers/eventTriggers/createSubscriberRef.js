import { TRIGGER_SUBSCRIBER } from '../../constants';

export function createSubscriberRef(lambda = {}) {
  return {
    ref: {
      apiVersion: TRIGGER_SUBSCRIBER.API_VERSION,
      kind: TRIGGER_SUBSCRIBER.KIND,
      name: lambda.name || '',
      namespace: lambda.namespace || '',
    },
  };
}
