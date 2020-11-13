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
    const socket = io(url, {
      query: { ...urlTemplateVariables, resource, idToken },
      transports: ['websocket', 'polling'],
    });

    // socket.on('connect_error', err => console.log('CONNECT_ERROR', err));
    // socket.on('connect_timeout', err => console.log('CONNECT_TIMEOUT', err));
    // socket.on('connect', () => console.log('CONNECT'));
    // socket.on('disconnect', () => console.log('DISCONNECT'));
    // socket.on('error', err => console.log('DISCONNECT', err));
    // socket.on('reconnect', err => console.log('RECONNECT', err));

    socket.on('message', console.log);
    return () => socket.disconnect();
  }, [resource, dispatch]);
};

/* 
todo 
const {resource, loading, error } = useSubscribedResource(resourceType, resourceFilter?);
*/
