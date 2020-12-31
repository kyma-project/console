import React from 'react';
import { baseUrl, throwHttpError } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

export function useGet(path, onDataReceived) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();

  const refetch = React.useCallback(async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const urlToFetchFrom = baseUrl(fromConfig) + path;

      const response = await fetch(urlToFetchFrom, {
        headers: { Authorization: 'Bearer ' + idToken },
      });

      if (!response.ok) throw await throwHttpError(response);

      const payload = await response.json();
      if (typeof onDataReceived === 'function') onDataReceived(payload.items);
      setData(payload.items);
    } catch (e) {
      console.error(e);
      setError(e);
    }
    setLoading(false);
  }, [path, onDataReceived, idToken]);

  React.useEffect(() => {
    refetch();
  }, [path, refetch]);

  return { data, loading, error, refetch };
}
