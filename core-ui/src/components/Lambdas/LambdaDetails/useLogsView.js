import { useEffect, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

export const useLogsView = (name, namespace, selectedTabName) => {
  const [logsViewExists, setLogViewExists] = useState(false);

  useEffect(() => {
    const linkManager = LuigiClient.linkManager().withParams({
      namespace: namespace,
      instance: `~${name}-.+`,
      compact: 'true',
    });

    linkManager
      .pathExists('/home/cmf-logs')
      .then(exists => setLogViewExists(exists));

    let logsViewHandle;

    if (logsViewExists) {
      logsViewHandle = linkManager.openAsSplitView('/home/cmf-logs', {
        title: 'Logs',
        size: 40,
        collapsed: true,
      });

      if (selectedTabName === 'Configuration') {
        logsViewHandle.collapse();
      } else {
        logsViewHandle.expand();
      }
    }

    return () => {
      !!logsViewHandle && logsViewHandle.collapse();
    };
  }, [namespace, name, selectedTabName, logsViewExists]);
};
