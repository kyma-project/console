import { FUNCTION_CUSTOM_RESOURCE } from 'components/Lambdas/constants';

export function createOwnerRef(lambda = {}) {
  return {
    apiVersion: FUNCTION_CUSTOM_RESOURCE.API_VERSION,
    kind: FUNCTION_CUSTOM_RESOURCE.KIND,
    name: lambda.name || '',
    UID: lambda.UID || '',
  };
}
