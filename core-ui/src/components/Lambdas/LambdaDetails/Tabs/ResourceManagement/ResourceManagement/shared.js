import React from 'react';
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
export const customPreset = 'custom';

export const inputNames = {
  replicas: {
    preset: 'replicasLabel',
    min: 'minReplicas',
    max: 'maxReplicas',
  },
  function: {
    preset: 'functionPresetLabel',
    requests: {
      cpu: 'functionRequestsCpu',
      memory: 'functionRequestsMemory',
    },
    limits: { cpu: 'functionLimitsCpu', memory: 'functionLimitsMemory' },
  },
  buildJob: {
    preset: 'buildPresetLabel',
    requests: {
      cpu: 'buildRequestsCpu',
      memory: 'buildRequestsMemory',
    },
    limits: { cpu: 'buildLimitsCpu', memory: 'buildLimitsMemory' },
  },
};

export function ErrorMessage({ errors = {}, field = '' }) {
  return errors[field]?.message ? (
    <div className={errorClassName}>{errors[field].message}</div>
  ) : null;
}

function prepareSchema() {
  const errorMessages = RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES;
  const MIN_MEMORY_VALUE_ERROR = (type = 'function') =>
    formatMessage(errorMessages.MEMORY.TOO_LOW, {
      minValue: CONFIG[`${type}MinResources`]?.memory || '',
    });
  const MIN_CPU_VALUE_ERROR = (type = 'function') =>
    formatMessage(errorMessages.CPU.TOO_LOW, {
      minValue: CONFIG[`${type}MinResources`]?.cpu || '',
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

    // FUNCTION
    [inputNames.function.preset]: yup.string(),
    [inputNames.function.requests.cpu]: yup
      .string()
      .matches(CPU_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.CPU.DEFAULT,
      })
      .test('matchFunctionMinRequestCPU', MIN_CPU_VALUE_ERROR(), function(arg) {
        return testMinCPU(arg);
      })
      .test(
        'matchFunctionRequestCPU',
        errorMessages.CPU.REQUEST_TOO_HIGH,
        function(arg) {
          const normalizedLimit = normalizeCPU(this.parent.functionLimitsCpu);
          if (!normalizedLimit) {
            return true;
          }

          const normalizedRequest = normalizeCPU(arg);
          return normalizedRequest <= normalizedLimit;
        },
      ),
    [inputNames.function.limits.cpu]: yup
      .string()
      .matches(CPU_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.CPU.DEFAULT,
      })
      .test('matchFunctionMinLimitCPU', MIN_CPU_VALUE_ERROR(), function(arg) {
        return testMinCPU(arg);
      })
      .test('matchFunctionLimitCPU', errorMessages.CPU.LIMITS_TOO_LOW, function(
        arg,
      ) {
        if (!arg) {
          return true;
        }
        const normalizedRequest = normalizeCPU(this.parent.functionRequestsCpu);
        const normalizedLimit = normalizeCPU(arg);
        return normalizedRequest <= normalizedLimit;
      }),
    [inputNames.function.requests.memory]: yup
      .string()
      .matches(MEMORY_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.MEMORY.DEFAULT,
      })
      .test('matchFunctionMinRequestMemory', MIN_MEMORY_VALUE_ERROR(), function(
        arg,
      ) {
        return testMinMemory(arg);
      })
      .test(
        'matchFunctionRequestMemory',
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
    [inputNames.function.limits.memory]: yup
      .string()
      .matches(MEMORY_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.MEMORY.DEFAULT,
      })
      .test('matchFunctionMinLimitMemory', MIN_MEMORY_VALUE_ERROR(), function(
        arg,
      ) {
        return testMinMemory(arg);
      })
      .test(
        'matchFunctionLimitMemory',
        errorMessages.MEMORY.LIMITS_TOO_LOW,
        function(arg) {
          if (!arg) {
            return true;
          }

          const normalizedRequest = normalizeMemory(
            this.parent.functionRequestsMemory,
          );
          const normalizedLimit = normalizeMemory(arg);
          return normalizedRequest <= normalizedLimit;
        },
      ),

    // BUILD_JOB
    [inputNames.buildJob.preset]: yup.string(),
    [inputNames.buildJob.requests.cpu]: yup
      .string()
      .matches(CPU_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.CPU.DEFAULT,
      })
      .test(
        'matchBuildMinRequestCPU',
        MIN_CPU_VALUE_ERROR('buildJob'),
        function(arg) {
          return testMinCPU(arg, 'buildJob');
        },
      )
      .test(
        'matchBuildRequestCPU',
        errorMessages.CPU.REQUEST_TOO_HIGH,
        function(arg) {
          const normalizedLimit = normalizeCPU(this.parent.buildLimitsCpu);
          if (!normalizedLimit) {
            return true;
          }

          const normalizedRequest = normalizeCPU(arg);
          return normalizedRequest <= normalizedLimit;
        },
      ),
    [inputNames.buildJob.limits.cpu]: yup
      .string()
      .matches(CPU_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.CPU.DEFAULT,
      })
      .test('matchBuildMinLimitCPU', MIN_CPU_VALUE_ERROR('buildJob'), function(
        arg,
      ) {
        return testMinCPU(arg, 'buildJob');
      })
      .test('matchBuildLimitCPU', errorMessages.CPU.LIMITS_TOO_LOW, function(
        arg,
      ) {
        if (!arg) {
          return true;
        }
        const normalizedRequest = normalizeCPU(this.parent.buildRequestsCpu);
        const normalizedLimit = normalizeCPU(arg);
        return normalizedRequest <= normalizedLimit;
      }),
    [inputNames.buildJob.requests.memory]: yup
      .string()
      .matches(MEMORY_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.MEMORY.DEFAULT,
      })
      .test(
        'matchBuildMinRequestMemory',
        MIN_MEMORY_VALUE_ERROR('buildJob'),
        function(arg) {
          return testMinMemory(arg, 'buildJob');
        },
      )
      .test(
        'matchBuildRequestMemory',
        errorMessages.MEMORY.REQUEST_TOO_HIGH,
        function(arg) {
          const normalizedLimit = normalizeMemory(
            this.parent.buildLimitsMemory,
          );
          if (!normalizedLimit) {
            return true;
          }

          const normalizedRequest = normalizeMemory(arg);
          return normalizedRequest <= normalizedLimit;
        },
      ),
    [inputNames.buildJob.limits.memory]: yup
      .string()
      .matches(MEMORY_REGEXP, {
        excludeEmptyString: true,
        message: errorMessages.MEMORY.DEFAULT,
      })
      .test(
        'matchBuildMinLimitMemory',
        MIN_MEMORY_VALUE_ERROR('buildJob'),
        function(arg) {
          return testMinMemory(arg, 'buildJob');
        },
      )
      .test(
        'matchBuildLimitMemory',
        errorMessages.MEMORY.LIMITS_TOO_LOW,
        function(arg) {
          if (!arg) {
            return true;
          }

          const normalizedRequest = normalizeMemory(
            this.parent.buildRequestsMemory,
          );
          const normalizedLimit = normalizeMemory(arg);
          return normalizedRequest <= normalizedLimit;
        },
      ),
  });
}

function testMinCPU(arg, type = 'function') {
  if (!arg) {
    return true;
  }
  return compareCpu(CONFIG[`${type}MinResources`]?.cpu, arg);
}

function testMinMemory(arg, type = 'function') {
  if (!arg) {
    return true;
  }
  return compareMemory(CONFIG[`${type}MinResources`]?.memory, arg);
}

export function checkReplicasPreset(functionReplicas, presets) {
  const possiblePreset = Object.entries(presets).find(([_, values]) => {
    return (
      values.min === functionReplicas.min && values.max === functionReplicas.max
    );
  });
  if (possiblePreset) {
    return possiblePreset[0];
  }
  return customPreset;
}

export function checkResourcesPreset(functionResources, presets) {
  const possiblePreset = Object.entries(presets).find(([_, values]) => {
    return (
      values?.requestMemory === functionResources?.requests?.memory &&
      values?.requestCpu === functionResources?.requests?.cpu &&
      values?.limitMemory === functionResources?.limits?.memory &&
      values?.limitCpu === functionResources?.limits?.cpu
    );
  });
  if (possiblePreset) {
    return possiblePreset[0];
  }
  return customPreset;
}

export function isCustomPreset(preset) {
  return preset === customPreset;
}

export function updateResourcesValidationSchema() {
  Object.assign(schema, prepareSchema());
}
export const schema = prepareSchema();
