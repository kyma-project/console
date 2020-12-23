import { baseUrl, throwHttpError } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

export const useGenericCreate = () => {
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  const url = baseUrl(fromConfig) + '/resource';

  return async resource => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) throw await throwHttpError(response);

    return await response.json();
  };
};
