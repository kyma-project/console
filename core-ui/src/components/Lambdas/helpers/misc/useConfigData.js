import { useEffect } from 'react';
import { useConfigMapQuery } from 'components/Lambdas/gql/hooks';

import {
  WEBHOOK_DEFAULTS_CM_NAME,
  KYMA_SYSTEM_NAMESPACE,
  WEBHOOK_VALIDATION,
  updateConfig,
} from 'components/Lambdas/config';

import { updateResourcesValidationSchema } from 'components/Lambdas/LambdaDetails/Tabs/Configuration/ResourceManagement/shared';

export const useConfigData = () => {
  const { cmData } = useConfigMapQuery({
    name: WEBHOOK_DEFAULTS_CM_NAME,
    namespace: KYMA_SYSTEM_NAMESPACE,
  });

  function updateRestrictedVariables() {
    if (cmData[WEBHOOK_VALIDATION.RESERVED_ENVS]) {
      const variables = cmData[WEBHOOK_VALIDATION.RESERVED_ENVS].split(',');
      updateConfig('restrictedVariables', variables);
    }
  }

  function updateResources() {
    if (
      cmData[WEBHOOK_VALIDATION.MIN_REQUEST_CPU] &&
      cmData[WEBHOOK_VALIDATION.MIN_REQUEST_MEMORY]
    ) {
      const resources = {
        min: {
          cpu: cmData[WEBHOOK_VALIDATION.MIN_REQUEST_CPU],
          memory: cmData[WEBHOOK_VALIDATION.MIN_REQUEST_MEMORY],
        },
      };
      updateConfig('resources', resources);
      updateResourcesValidationSchema();
    }
  }

  useEffect(() => {
    updateRestrictedVariables();
    updateResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmData]);

  return;
};
