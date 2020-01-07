import React, { createContext, useContext, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

export const ApplicationContext = createContext({});

export const ApplicationContextProvider = ({ children }) => {
  const [context, setContext] = useState(LuigiClient.getContext());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    LuigiClient.addInitListener(setContext);
    LuigiClient.addContextUpdateListener(setContext);
  });

  return (
    <ApplicationContext.Provider value={context}>
      {children}
    </ApplicationContext.Provider>
  );
};

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

export const withApplicationContext = Component => props => (
  <ApplicationContext.Consumer>
    {value => <Component {...props} context={value} />}
  </ApplicationContext.Consumer>
);
