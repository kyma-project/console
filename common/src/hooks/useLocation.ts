import { useEffect, useState } from 'react';
import { globalHistory, HistoryLocation } from '@reach/router';

interface HookReturnVal {
  location: HistoryLocation;
}

export const useLocation = (): HookReturnVal => {
  const initialState = {
    location: globalHistory.location,
  };

  const [state, setState] = useState(initialState);
  useEffect(() => {
    const removeListener = globalHistory.listen(params => {
      setState({
        location: params.location,
      });
    });
    return () => {
      removeListener();
    };
  }, []);

  return state;
};
