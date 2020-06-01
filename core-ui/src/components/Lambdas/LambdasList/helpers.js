import { randomNamesGenerator } from '@kyma-project/common';
import { LAMBDAS_LIST } from 'components/Lambdas/constants';

export function validateFunctionName(name = '', functionNames = []) {
  if (!name) {
    return LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.EMPTY;
  }

  if (name.length > 63) {
    return LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.TOO_LONG;
  }

  const regex = /^[a-z]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  if (!regex.test(name)) {
    return LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.INVALID;
  }

  if (functionNames.includes(name)) {
    return LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.DUPLICATED;
  }

  return '';
}

export function randomNameGenerator(functionNames = []) {
  let name = '';
  do {
    name = randomNamesGenerator();
  } while (functionNames.includes(name));
  return name;
}
