import LuigiClient from '@luigi-project/client';

import { formatMessage, backendModulesExist, BACKEND_MODULES } from '../misc';
import { LOGS_AND_METRICS } from 'components/Lambdas/constants';

const CMF_LOGS_PATH = '/home/cmf-logs';

function logsViewHelpersFunc() {
  function createParams(lambda) {
    return {
      namespace: lambda.namespace,
      functionUID: lambda.UID,
      compact: 'true',
      container: '~(executor|lambda)',
    };
  }

  return {
    isLogsViewExists() {
      const backendModules = LuigiClient.getEventData().backendModules;
      return backendModulesExist(backendModules, [BACKEND_MODULES.LOGGING]);
    },
    openAsModal(lambda) {
      if (!lambda) {
        return;
      }

      const params = createParams(lambda);
      const title = formatMessage(LOGS_AND_METRICS.LOGS.MODAL.TITLE, {
        lambdaName: lambda.name,
      });

      LuigiClient.linkManager()
        .withParams(params)
        .openAsModal(CMF_LOGS_PATH, { title });
    },
    openAsSplitView(lambda, initialCollapse = true) {
      if (!lambda) {
        return;
      }

      const params = createParams(lambda);
      return LuigiClient.linkManager()
        .withParams(params)
        .openAsSplitView(CMF_LOGS_PATH, {
          title: LOGS_AND_METRICS.LOGS.SPLIT_VIEW.TITLE,
          size: 40,
          collapsed: initialCollapse,
        });
    },
  };
}

export const logsViewHelpers = logsViewHelpersFunc();
