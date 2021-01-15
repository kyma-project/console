import { SERVICE_API_VERSION, SERVICE_RESOURCE_KIND } from './../../constants';

import { createOwnerRef } from 'shared/components/EventSubscriptions/helpers';

export function createServiceRef(service) {
  return createOwnerRef(SERVICE_API_VERSION, SERVICE_RESOURCE_KIND, service);
}
