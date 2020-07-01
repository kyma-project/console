import { FUNCTION_CUSTOM_RESOURCE } from 'components/Lambdas/constants';

export function createOwnerRef({ name, UID } = {}) {
  return {
    apiVersion: FUNCTION_CUSTOM_RESOURCE.API_VERSION,
    kind: FUNCTION_CUSTOM_RESOURCE.KIND,
    name: name || '',
    UID: UID || '',
  };
}
