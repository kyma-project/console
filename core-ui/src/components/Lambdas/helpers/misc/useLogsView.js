import { useEffect, useState } from 'react';
import LuigiClient from '@luigi-project/client';

import { CONFIG } from 'components/Lambdas/config';
import { LOGS_AND_METRICS } from 'components/Lambdas/constants';

const CMF_LOGS_PATH = '/home/cmf-logs';

function runFnOnContextUpdate(url, cleanupFn) {
  if (url !== window.location.pathname) {
    cleanupFn();
  }
  LuigiClient.removeContextUpdateListener(runFnOnContextUpdate);
}

export const useLogsView = (uid, namespace, initialCollapse = true) => {
  const [logsViewExists, setLogViewExists] = useState(false);

  useEffect(() => {
    const {
      jobContainerName,
      deploymentContainerName,
      repoFetcherContainerName,
    } = CONFIG.logging;

    const linkManager = LuigiClient.linkManager().withParams({
      namespace: namespace,
      functionUID: uid,
      compact: 'true',
      container: `~(${jobContainerName}|${deploymentContainerName}|${repoFetcherContainerName})`,
    });

    checkLogsViewExists(linkManager, setLogViewExists);

    let logsViewHandle;
    if (logsViewExists) {
      logsViewHandle = openLogsView(linkManager, initialCollapse);
    }

    const cleanup = () => {
      // workaround for destroy splitView with navigation from details to list view
      // close doesn't work with collapsed state, so first expand and then close
      logsViewHandle && logsViewHandle.expand();
      logsViewHandle && logsViewHandle.close();
    };

    // when user switches to another MF, useEffects's cleanup
    // function may not be fired - detect it manually
    LuigiClient.addContextUpdateListener(() =>
      runFnOnContextUpdate(window.location.pathname, cleanup),
    );

    return cleanup;
  }, [namespace, uid, logsViewExists, initialCollapse]);
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

const openLogsView = (manager, initialCollapse) => {
  return manager.openAsSplitView(CMF_LOGS_PATH, {
    title: LOGS_AND_METRICS.LOGS.SPLIT_VIEW.TITLE,
    size: 40,
    collapsed: initialCollapse,
  });
};
