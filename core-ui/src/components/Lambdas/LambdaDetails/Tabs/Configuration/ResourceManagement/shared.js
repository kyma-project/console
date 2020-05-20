import * as yup from 'yup';

import {
  CPU_REGEXP,
  MEMORY_REGEXP,
} from 'components/Lambdas/helpers/resources';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';

export const inputClassName = 'resource_input';
export const errorClassName = 'error_message';

export const inputNames = {
  replicas: {
    min: 'minReplicas',
    max: 'maxReplicas',
  },
  requests: {
    cpu: 'requestsCpu',
    memory: 'requestsMemory',
  },
  limits: { cpu: 'limitsCpu', memory: 'limitsMemory' },
};

const errorMessages = RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES;
export const schema = yup.object().shape({
  [inputNames.replicas.min]: yup
    .number()
    .transform((val, originalVal) => {
      return originalVal === '' ? -1 : val; // -1 so that instead of throwing errors about NaN it will pass validation here, but fail on min(0) with nicer error message
    })
    .min(0, errorMessages.MIN_REPLICAS_NON_NEGATIVE)
    .integer(errorMessages.MIN_REPLICAS_NON_NEGATIVE)
    .test('matchMinReplicas', errorMessages.MIN_REPLICAS_TOO_HIGH, function(
      arg,
    ) {
      return arg <= this.parent.maxReplicas;
    }),
  [inputNames.replicas.max]: yup
    .number()
    .transform((val, originalVal) => {
      return originalVal === '' ? -1 : val; // -1 so that instead of throwing errors about NaN it will pass validation here, but fail on min(0) with nicer error message
    })
    .min(0, errorMessages.MAX_REPLICAS_NON_NEGATIVE)
    .integer(errorMessages.MAX_REPLICAS_NON_NEGATIVE)
    .test('matchMaxReplicas', errorMessages.MAX_REPLICAS_TOO_LOW, function(
      arg,
    ) {
      return arg >= this.parent.minReplicas;
    }),
  [inputNames.requests.cpu]: yup.string().matches(CPU_REGEXP, {
    excludeEmptyString: true,
    message: errorMessages.CPU,
  }),
  [inputNames.limits.cpu]: yup.string().matches(CPU_REGEXP, {
    excludeEmptyString: true,
    message: errorMessages.CPU,
  }),
  [inputNames.requests.memory]: yup.string().matches(MEMORY_REGEXP, {
    excludeEmptyString: true,
    message: errorMessages.MEMORY,
  }),
  [inputNames.limits.memory]: yup.string().matches(MEMORY_REGEXP, {
    excludeEmptyString: true,
    message: errorMessages.MEMORY,
  }),
});
