import { CONFIG } from '../../config';

export function createSubscriberRef(lambda = {}, uri) {
  return {
    ref: {
      apiVersion: CONFIG.triggerSubscriber.apiVersion,
      kind: CONFIG.triggerSubscriber.kind,
      name: lambda.name || '',
      namespace: lambda.namespace || '',
    },
    uri,
  };
}
