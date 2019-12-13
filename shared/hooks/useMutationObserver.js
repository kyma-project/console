import React from 'react';

export default function useMutationObserver(ref, changeCallback, options) {
  options = {
    childList: true,
    subtree: true,
    ...options,
  };

  const callback = (mutationsList, observer) => {
    console.log('halo', typeof changeCallback);
    if (typeof changeCallback === 'function') {
      changeCallback(ref.current, mutationsList, observer);
    }
  };

  React.useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);
}
