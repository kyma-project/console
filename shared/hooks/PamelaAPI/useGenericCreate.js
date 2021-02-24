import { baseUrl, throwHttpError } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

export const useGenericCreate = () => {
  const { idToken, k8sApiUrl } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  const url = baseUrl(fromConfig) + '/resource';

  return async resource => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
        'X-Api-Url': k8sApiUrl,
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) throw await throwHttpError(response);

    return await response.json();
  };
};
