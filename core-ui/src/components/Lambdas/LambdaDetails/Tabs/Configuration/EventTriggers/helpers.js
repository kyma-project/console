import {
  SERVERLESS_API_VERSION,
  SERVERLESS_RESOURCE_KIND,
} from './../../../../constants';

function createOwnerRef(apiVersion, kind, entry) {
  return {
    apiVersion,
    kind,
    name: entry.name,
    UID: entry.UID,
  };
}

export function createLambdaRef(lambda) {
  return createOwnerRef(
    SERVERLESS_API_VERSION,
    SERVERLESS_RESOURCE_KIND,
    lambda,
  );
}
