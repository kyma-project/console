import React, { useCallback } from 'react';
import { baseUrl, throwHttpError } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

const useGetHook = processDataFn =>
  function(path, { pollingInterval, onDataReceived }) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { idToken } = useMicrofrontendContext();
    const { fromConfig } = useConfig();

    const refetch = React.useCallback(
      shouldTriggerLoading => async () => {
        if (!idToken) return;

        if (shouldTriggerLoading) setLoading(true);
        try {
          const urlToFetchFrom = baseUrl(fromConfig) + path;

          const response = await fetch(urlToFetchFrom, {
            headers: { Authorization: 'Bearer ' + idToken },
          });

          if (!response.ok) throw await throwHttpError(response);

          const payload = await response.json();

          if (typeof onDataReceived === 'function')
            onDataReceived(payload.items);

          processDataFn(payload, data, setData);
        } catch (e) {
          console.error(e);
          setError(e);
        }
        if (shouldTriggerLoading) setLoading(false);
      },
      [path, idToken, data],
    );

    React.useEffect(() => {
      refetch(true)();

      if (pollingInterval) {
        const intervalId = setInterval(refetch(false), pollingInterval);
        return _ => clearInterval(intervalId);
      }
    }, [path, refetch, pollingInterval]);

    return { data, loading, error, refetch: refetch(true) };
  };

export const useGetList = useGetHook(handleListDataReceived);
// export const useGet = useGetHook(handleSingleDataReceived); // TODO for a single object

function handleListDataReceived(newData, oldData, setDataFn) {
  if (
    !oldData ||
    oldData.length !== newData.items.length ||
    newData.items.every((newItem, index) => {
      newItem.metadata.resourceVersion ===
        oldData[index].metadata.resourceVersion;
    })
  )
    setDataFn(newData.items);
}
