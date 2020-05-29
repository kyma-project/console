import { useEffect, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { CONFIG } from 'components/Lambdas/config';

const CMF_LOGS_PATH = '/home/cmf-logs';

export const useLogsView = (uid, namespace) => {
  const [logsViewExists, setLogViewExists] = useState(false);

  useEffect(() => {
    const { jobContainerName, deploymentContainerName } = CONFIG.logging;

    const linkManager = LuigiClient.linkManager().withParams({
      namespace: namespace,
      functionUID: uid,
      compact: 'true',
      container: `~(${jobContainerName}|${deploymentContainerName})`,
    });

    checkLogsViewExists(linkManager, setLogViewExists);

    let logsViewHandle;
    if (logsViewExists) {
      logsViewHandle = openLogsView(linkManager);
    }

    return () => {
      !!logsViewHandle && logsViewExists && logsViewHandle.collapse();
    };
  }, [namespace, uid, logsViewExists]);
};

const checkLogsViewExists = async (manager, setViewExists) => {
  try {
    const exists = await manager.pathExists(CMF_LOGS_PATH);
    setViewExists(exists);
  } catch (err) {
    console.error(err);
    setViewExists(false);
  }
};

const openLogsView = manager => {
  const logsViewHandle = manager.openAsSplitView(CMF_LOGS_PATH, {
    title: 'Logs',
    size: 40,
    collapsed: true,
  });

  logsViewHandle.collapse();
  return logsViewHandle;
};
