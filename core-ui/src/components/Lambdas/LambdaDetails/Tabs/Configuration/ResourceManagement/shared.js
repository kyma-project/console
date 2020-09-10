import * as yup from 'yup';

import {
  CPU_REGEXP,
  MEMORY_REGEXP,
  normalizeCPU,
  normalizeMemory,
  compareCpu,
  compareMemory,
} from 'components/Lambdas/helpers/resources';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { CONFIG } from 'components/Lambdas/config';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';

export const inputClassName = 'resource_input';
export const errorClassName = 'error_message';

export const inputNames = {
  replicas: {
    min: 'minReplicas',
    max: 'maxReplicas',
  },
  functionResources: {
    requests: {
      cpu: 'functionRequestsCpu',
      memory: 'functionRequestsMemory',
    },
    limits: { cpu: 'functionLimitsCpu', memory: 'functionLimitsMemory' },
  },
  buildResources: {
    requests: {
      cpu: 'buildRequestsCpu',
      memory: 'buildRequestsMemory',
    },
    limits: { cpu: 'buildLimitsCpu', memory: 'buildLimitsMemory' },
  },
};

function prepareSchema() {
  const errorMessages = RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES;
  const MIN_MEMORY_VALUE_ERROR = formatMessage(errorMessages.MEMORY.TOO_LOW, {
    minValue: CONFIG.resources?.min?.memory || '',
  });
  const MIN_CPU_VALUE_ERROR = formatMessage(errorMessages.CPU.TOO_LOW, {
    minValue: CONFIG.resources?.min?.cpu || '',
  });

  return yup.object().shape({
    [inputNames.replicas.min]: yup
      .number()
      .transform((val, originalVal) => {
        return originalVal === '' ? -1 : val; // -1 so that instead of throwing errors about NaN it will pass validation here, but fail on min(0) with nicer error message
      })
      .positive(errorMessages.MIN_REPLICAS_POSITIVE)
      .integer(errorMessages.MIN_REPLICAS_POSITIVE)
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
      .positive(errorMessages.MAX_REPLICAS_POSITIVE)
      .integer(errorMessages.MAX_REPLICAS_POSITIVE)
      .test('matchMaxReplicas', errorMessages.MAX_REPLICAS_TOO_LOW, function(
        arg,
      ) {
        return arg >= this.parent.minReplicas;
      }),
    [inputNames.functionResources.requests.cpu]: yup
      .string()
      .matches(CPU_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.CPU.DEFAULT,
      })
      .test('matchMinRequestCPU', MIN_CPU_VALUE_ERROR, function(arg) {
        return testMinCPU(arg);
      })
      .test('matchRequestCPU', errorMessages.CPU.REQUEST_TOO_HIGH, function(
        arg,
      ) {
        const normalizedLimit = normalizeCPU(this.parent.functionLimitsCpu);
        if (!normalizedLimit) {
          return true;
        }

        const normalizedRequest = normalizeCPU(arg);
        return normalizedRequest <= normalizedLimit;
      }),
    [inputNames.functionResources.limits.cpu]: yup
      .string()
      .matches(CPU_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.CPU.DEFAULT,
      })
      .test('matchMinLimitCPU', MIN_CPU_VALUE_ERROR, function(arg) {
        return testMinCPU(arg);
      })
      .test('matchLimitCPU', errorMessages.CPU.LIMITS_TOO_LOW, function(arg) {
        if (!arg) {
          return true;
        }
        const normalizedRequest = normalizeCPU(this.parent.functionRequestsCpu);
        const normalizedLimit = normalizeCPU(arg);
        return normalizedRequest <= normalizedLimit;
      }),
    [inputNames.functionResources.requests.memory]: yup
      .string()
      .matches(MEMORY_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.MEMORY.DEFAULT,
      })
      .test('matchMinRequestMemory', MIN_MEMORY_VALUE_ERROR, function(arg) {
        return testMinMemory(arg);
      })
      .test(
        'matchRequestMemory',
        errorMessages.MEMORY.REQUEST_TOO_HIGH,
        function(arg) {
          const normalizedLimit = normalizeMemory(
            this.parent.functionLimitsMemory,
          );
          if (!normalizedLimit) {
            return true;
          }

          const normalizedRequest = normalizeMemory(arg);
          return normalizedRequest <= normalizedLimit;
        },
      ),
    [inputNames.functionResources.limits.memory]: yup
      .string()
      .matches(MEMORY_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.MEMORY.DEFAULT,
      })
      .test('matchMinLimitMemory', MIN_MEMORY_VALUE_ERROR, function(arg) {
        return testMinMemory(arg);
      })
      .test('matchLimitMemory', errorMessages.MEMORY.LIMITS_TOO_LOW, function(
        arg,
      ) {
        if (!arg) {
          return true;
        }

        const normalizedRequest = normalizeMemory(
          this.parent.functionRequestsMemory,
        );
        const normalizedLimit = normalizeMemory(arg);
        return normalizedRequest <= normalizedLimit;
      }),
  });
}

function testMinCPU(arg) {
  if (!arg) {
    return true;
  }
  return compareCpu(CONFIG.resources?.min?.cpu, arg);
}

function testMinMemory(arg) {
  if (!arg) {
    return true;
  }
  return compareMemory(CONFIG.resources?.min?.memory, arg);
}

export function updateResourcesValidationSchema() {
  Object.assign(schema, prepareSchema());
}
export const schema = prepareSchema();
