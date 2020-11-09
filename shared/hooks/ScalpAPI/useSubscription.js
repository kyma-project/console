import io from 'socket.io-client';
import React from 'react';
import { baseUrl } from './config';

export const useSubscription = (resource, dispatch) => {
  React.useEffect(() => {
    const socket = io(baseUrl, { query: `resource=${resource}` });
    socket.on('message', dispatch);
    return () => socket.disconnect();
  }, [resource, dispatch]);
};

/* 
todo 
const {resource, loading, error } = useSubscribedResource(resourceType, resourceFilter?);
*/

// socket.on('connect_error', (err) => dispatch('CONNECT_ERROR', err));
// socket.on('connect_timeout', (err) => dispatch('CONNECT_TIMEOUT', err));
// socket.on('connect', () => dispatch('CONNECT'));
// socket.on('disconnect', () => dispatch('DISCONNECT'));
// socket.on('error', (err) => dispatch('DISCONNECT', err));
// socket.on('reconnect', (err) => dispatch('RECONNECT', err));
