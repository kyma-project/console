import React from 'react';
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

    const refetch = (isSilent, currentData) => async () => {
      if (!idToken) return;
      if (!isSilent) setLoading(true);

      function processError(error) {
        console.error(error);
        if (!isSilent) setError(error);
      }

      try {
        const urlToFetchFrom = baseUrl(fromConfig) + path;
        const response = await fetch(urlToFetchFrom, {
          headers: { Authorization: 'Bearer ' + idToken },
        });

        if (!response.ok) processError(await throwHttpError(response));
        const payload = await response.json();

        if (typeof onDataReceived === 'function') onDataReceived(payload.items);
        if (error) setError(null); // bring back the data and clear the error once the connection started working again

        processDataFn(payload, currentData, setData);
      } catch (e) {
        processError(e);
      }

      if (!isSilent) setLoading(false);
    };

    React.useEffect(() => {
      if (pollingInterval) {
        const intervalId = setInterval(refetch(true, data), pollingInterval);
        return _ => clearInterval(intervalId);
      }
    }, [path, pollingInterval, data]);

    React.useEffect(() => {
      refetch(false, data)();
    }, [path]);

    return {
      data,
      loading,
      error,
      refetch: refetch(false, data),
      silentRefetch: refetch(true, data),
    };
  };

export const useGetList = useGetHook(handleListDataReceived);
// export const useGet = useGetHook(handleSingleDataReceived); // TODO for a single object

function handleListDataReceived(newData, oldData, setDataFn) {
  if (
    !oldData || // current data is empty and we received some. There's no doubdt we should update.
    oldData.length !== newData.items.length || // current and received items are different length. We need to update.
    !newData.items.every(
      (newItem, index) =>
        newItem.metadata.resourceVersion ===
        oldData[index].metadata.resourceVersion,
    ) // current and received items are the same length but the items might have changed. Compare its resourceVersion to check it.
  )
    setDataFn(newData.items);
}
