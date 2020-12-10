import {
  SERVERLESS_API_VERSION,
  SERVERLESS_RESOURCE_KIND,
} from './../../../../constants';

import { createOwnerRef } from 'shared/components/EventSubscriptions/helpers';

export function createLambdaRef(lambda) {
  return createOwnerRef(
    SERVERLESS_API_VERSION,
    SERVERLESS_RESOURCE_KIND,
    lambda,
  );
}
