import { TRIGGER_SUBSCRIBER } from '../../constants';

export function createOwnerRef(lambda = {}) {
  return {
    apiVersion: TRIGGER_SUBSCRIBER.SERVING_API_VERSION,
    kind: TRIGGER_SUBSCRIBER.SERVING_SERVICE,
    name: lambda.name || '',
    UID: lambda.UID || '',
  };
}
