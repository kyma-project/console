import { baseUrl } from './config';

export function mutation(method) {
  // todo encode in body?
  const encodeParams = p =>
    Object.entries(p)
      .map(kv => kv.map(encodeURIComponent).join('='))
      .join('&');

  return (resourceType, options) => {
    return async data => {
      const url = `${baseUrl}${resourceType}?${encodeParams(data)}`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw Error(response.statusText);
      if (typeof options?.refetch === 'function') options.refetch();
      return await response.json();
    };
  };
}

export const useUpdate = mutation('PATCH');
export const useDelete = mutation('DELETE');
