import { baseUrl } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

const useMutation = method => {
  return (resourceType, options) => {
    const { idToken } = useMicrofrontendContext();
    const { fromConfig } = useConfig();
    return async data => {
      let url =
        baseUrl(fromConfig) +
        (data?.namespace ? `/namespaces/${data.namespace}/` : '/') +
        resourceType +
        `/${data.name}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }
      if (typeof options?.refetch === 'function') options.refetch();
      return await response.json();
    };
  };
};

export const useUpdate = useMutation('PUT');
export const useDelete = useMutation('DELETE');
