import { useEffect, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

const CMF_LOGS_PATH = '/home/cmf-logs';

export const useLogsView = (name, namespace, selectedTabName) => {
  const [logsViewExists, setLogViewExists] = useState(false);

  useEffect(() => {
    const linkManager = LuigiClient.linkManager().withParams({
      namespace: namespace,
      function: name,
      compact: 'true',
    });

    checkLogsViewExists(linkManager, setLogViewExists);

    let logsViewHandle;

    if (logsViewExists) {
      logsViewHandle = openLogsView(linkManager, selectedTabName);
    }

    return () => {
      !!logsViewHandle && logsViewExists && logsViewHandle.collapse();
    };
  }, [namespace, name, selectedTabName, logsViewExists]);
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

const openLogsView = (manager, tabName) => {
  const logsViewHandle = manager.openAsSplitView(CMF_LOGS_PATH, {
    title: 'Logs',
    size: 40,
    collapsed: true,
  });

  if (tabName === 'Configuration') {
    logsViewHandle.collapse();
  } else {
    logsViewHandle.expand();
  }
  return logsViewHandle;
};
