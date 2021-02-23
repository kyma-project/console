import { baseUrl, throwHttpError } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

export const usePost = () => {
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  return async (url, data, options) => {
    const response = await fetch(baseUrl(fromConfig) + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw await throwHttpError(response);
    if (typeof options?.refetch === 'function') options.refetch();
    return await response.json();
  };
};
