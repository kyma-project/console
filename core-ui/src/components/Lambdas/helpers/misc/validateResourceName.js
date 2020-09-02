import { LAMBDAS_LIST } from 'components/Lambdas/constants';

export function validateResourceName(
  name = '',
  resourceNames = [],
  errorMessages = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS,
) {
  if (!errorMessages) {
    return '';
  }

  if (!name) {
    return errorMessages.EMPTY;
  }

  if (name.length > 63) {
    return errorMessages.TOO_LONG;
  }

  const regex = /^[a-z]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  if (!regex.test(name)) {
    return errorMessages.INVALID;
  }

  if (resourceNames.includes(name)) {
    return errorMessages.DUPLICATED;
  }

  return '';
}
