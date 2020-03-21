import { useState, useEffect, useRef } from 'react';

export const useStateWithCallback = initialState => {
  const callbackRef = useRef(() => void 0);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (callbackRef.current && typeof callbackRef.current === 'function') {
      callbackRef.current(state);
    }
  }, [state]);

  function extendedSetState(newState, callback = () => void 0) {
    callbackRef.current = callback;
    setState(newState);
  }

  return [state, extendedSetState];
};
