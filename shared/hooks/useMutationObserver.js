import React from 'react';

export default function useMutationObserver(ref, changeCallback, options) {
  options = {
    childList: true,
    subtree: true,
    ...options,
  };

  const callback = (mutationsList, observer) => {
    changeCallback(ref.current, mutationsList, observer);
  };

  React.useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [ref.current]);
}
