import React from 'react';
import { baseUrl } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

export function useGet(resourceType, onDataReceived, namespace) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const urlToFetchFrom =
        baseUrl(fromConfig) +
        (namespace ? `/namespaces/${namespace}/` : '/') +
        resourceType;

      const response = await fetch(urlToFetchFrom, {
        headers: { Authorization: 'Bearer ' + idToken },
      });
      if (!response.ok) throw Error(response.statusText);
      const payload = await response.json();
      if (typeof onDataReceived === 'function') onDataReceived(payload);
      setData(payload);
    } catch (e) {
      console.error(e);
      setError(e);
    }
    setLoading(false);
  }, [resourceType, onDataReceived]);

  React.useEffect(() => {
    refetch();
  }, [resourceType, refetch]);

  return { data, loading, error, refetch };
}
