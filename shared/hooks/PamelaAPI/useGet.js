import React, { useState, useRef } from 'react';
import { baseUrl, throwHttpError } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

const useGetHook = processDataFn =>
  function(path, { pollingInterval, onDataReceived, filter }) {
    const isHookMounted = React.useRef(true); // becomes 'false' after the hook is unmounted to avoid performing any async actions afterwards
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const { idToken, k8sApiUrl } = useMicrofrontendContext();
    const { fromConfig } = useConfig();

    const refetch = (isSilent, currentData) => async () => {
      if (!isSilent) setLoading(true);

      function processError(error) {
        console.error(error);
        if (!isSilent) setError(error);
      }

      try {
        const urlToFetchFrom = baseUrl(fromConfig) + path;
        const response = await fetch(urlToFetchFrom, {
          headers: {
            Authorization: 'Bearer ' + idToken,
            'X-Api-Url': k8sApiUrl,
          },
        });
        if (!response.ok) throw await throwHttpError(response);
        const payload = await response.json();

        if (!isHookMounted.current) return;
        if (typeof onDataReceived === 'function') onDataReceived(payload.items);
        if (error) setError(null); // bring back the data and clear the error once the connection started working again
        processDataFn(payload, currentData, setData);
      } catch (e) {
        processError(e);
      }

      if (!isSilent && isHookMounted.current) setLoading(false);
    };

    React.useEffect(() => {
      // POLLING
      if (!pollingInterval) return;

      const intervalId = setInterval(refetch(true, data), pollingInterval);
      return _ => clearInterval(intervalId);
    }, [path, pollingInterval, data]);

    React.useEffect(() => {
      // INITIAL FETCH
      isHookMounted.current = true;
      if (idToken) refetch(false, null)();
      return _ => {
        if (loading) setLoading(false);
        isHookMounted.current = false;
      };
    }, [path, idToken]);

    return {
      data,
      loading,
      error,
      refetch: refetch(false, data),
      silentRefetch: refetch(true, data),
    };
  };

export const useGetList = filter => useGetHook(handleListDataReceived(filter));
export const useGet = useGetHook(handleSingleDataReceived);

function handleListDataReceived(filter) {
  return (newData, oldData, setDataFn) => {
    if (filter) {
      newData.items = newData.items.filter(filter);
    }
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
  };
}

function handleSingleDataReceived(newData, oldData, setDataFn) {
  if (
    !oldData || // current data is empty and we received some. There's no doubdt we should update.
    newData.metadata.resourceVersion !== oldData.metadata.resourceVersion
  ) {
    // Compare resourceVersion.
    setDataFn(newData);
  }
}

export const useSingleGet = () => {
  const { idToken, k8sApiUrl } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  return url =>
    fetch(baseUrl(fromConfig) + url, {
      headers: {
        Authorization: 'Bearer ' + idToken,
        'X-Api-Url': k8sApiUrl,
      },
    });
};
