import io from 'socket.io-client';
import React from 'react';
import { baseUrl } from './config';
import { useMicrofrontendContext } from '../../contexts/MicrofrontendContext';
import { useConfig } from '../../contexts/ConfigContext';

export const useSubscription = (
  resource,
  dispatch,
  urlTemplateVariables = {},
) => {
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  let url = baseUrl(fromConfig);

  React.useEffect(() => {
    if (!idToken) return;
    const socket = io(url, {
      query: {
        ...urlTemplateVariables,
        resource,
        authorization: 'Bearer ' + idToken,
      },
      transports: ['websocket', 'polling'],
    });

    // socket.on('connect_error', err => console.log('CONNECT_ERROR', err));
    // socket.on('connect_timeout', err => console.log('CONNECT_TIMEOUT', err));
    // socket.on('connect', () => console.log('CONNECT'));
    // socket.on('disconnect', () => console.log('DISCONNECT'));
    // socket.on('error', err => console.log('DISCONNECT', err));
    // socket.on('reconnect', err => console.log('RECONNECT', err));

    socket.on('message', dispatch);
    return () => socket.disconnect();
  }, [resource, dispatch, idToken]);
};

/* 
todo 
const {resource, loading, error } = useSubscribedResource(resourceType, resourceFilter?);
*/

export function handleSubscriptionEvent(setResource) {
  const filterByName = obj => entry =>
    entry.metadata.name !== obj.metadata.name;

  return data => {
    const { type, object } = data;
    switch (type) {
      case 'ADDED':
        setResource(resource => {
          if (!resource.find(r => r.metadata.name === object.metadata.name)) {
            return [...resource, object];
          }
          return resource;
        });
        break;
      case 'DELETED':
        setResource(resource => resource.filter(filterByName(object)));
        break;
      case 'MODIFIED':
        setResource(
          resource => {
            if (!resource.find(r => r.metadata.name === object.metadata.name)) {
              return [...resource, object];
            }

            return resource.map(r => (filterByName(object)(r) ? r : object));
          }, // fancy
        );
        break;
      default:
        console.warn(data);
        break;
    }
  };
}
