import { useEffect } from 'react';
import { useConfigMapQuery } from 'components/Lambdas/gql/hooks';

import {
  WEBHOOK_DEFAULTS_CM_NAME,
  KYMA_SYSTEM_NAMESPACE,
  WEBHOOK_ENVS,
  updateConfig,
} from 'components/Lambdas/config';

import { updateResourcesValidationSchema } from 'components/Lambdas/LambdaDetails/Tabs/ResourceManagement/ResourceManagement/shared';

export const useConfigData = () => {
  const { cmData } = useConfigMapQuery({
    name: WEBHOOK_DEFAULTS_CM_NAME,
    namespace: KYMA_SYSTEM_NAMESPACE,
  });

  function updateRestrictedVariables() {
    if (cmData[WEBHOOK_ENVS.RESERVED_ENVS]) {
      const variables = cmData[WEBHOOK_ENVS.RESERVED_ENVS].split(',');
      updateConfig('restrictedVariables', variables);
    }
  }

  function updateResources() {
    // Min. Function replicas
    if (cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_DEFAULT_PRESET]) {
      updateConfig(
        'functionMinReplicas',
        cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_DEFAULT_PRESET],
      );
    }

    // Function replicas
    if (
      cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_PRESETS_MAP] &&
      cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_DEFAULT_PRESET]
    ) {
      updateConfig(
        'defaultFunctionReplicasPreset',
        cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_DEFAULT_PRESET],
      );
      if (
        typeof cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_PRESETS_MAP] === 'string'
      ) {
        const functionPresets = JSON.parse(
          cmData[WEBHOOK_ENVS.FUNCTION_REPLICAS_PRESETS_MAP].trim(),
        );
        updateConfig('functionReplicasPresets', functionPresets);
      }
    }

    // Min. Function resources
    if (
      cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_MIN_REQUEST_CPU] &&
      cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_MIN_REQUEST_MEMORY]
    ) {
      const resources = {
        cpu: cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_MIN_REQUEST_CPU],
        memory: cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_MIN_REQUEST_MEMORY],
      };
      updateConfig('functionMinResources', resources);
    }

    // Min. BuildJob resources
    if (
      cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_MIN_REQUEST_CPU] &&
      cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_MIN_REQUEST_MEMORY]
    ) {
      const resources = {
        cpu: cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_MIN_REQUEST_CPU],
        memory: cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_MIN_REQUEST_MEMORY],
      };
      updateConfig('buildJobMinResources', resources);
    }

    // Function resources presets
    if (
      cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_PRESETS_MAP] &&
      cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_DEFAULT_PRESET]
    ) {
      updateConfig(
        'defaultFunctionResourcesPreset',
        cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_DEFAULT_PRESET],
      );
      if (
        typeof cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_PRESETS_MAP] === 'string'
      ) {
        const functionPresets = JSON.parse(
          cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_PRESETS_MAP].trim(),
        );
        updateConfig('functionResourcesPresets', functionPresets);
      }
    }

    // BuildJob resources presets
    if (
      cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_PRESETS_MAP] &&
      cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_DEFAULT_PRESET]
    ) {
      updateConfig(
        'defaultBuildJobResourcesPreset',
        cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_DEFAULT_PRESET],
      );
      if (
        typeof cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_PRESETS_MAP] === 'string'
      ) {
        const buildJobPresets = JSON.parse(
          cmData[WEBHOOK_ENVS.BUILD_JOB_RESOURCES_PRESETS_MAP].trim(),
        );
        updateConfig('buildJobResourcesPresets', buildJobPresets);
      }
    }

    updateResourcesValidationSchema();
  }

  useEffect(() => {
    updateRestrictedVariables();
    updateResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmData]);

  return;
};
