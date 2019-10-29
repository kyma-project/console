import React from 'react';
import { default as luigiClient } from '@kyma-project/luigi-client';
import createContainer from 'constate';

function useLuigiContext() {
  const [context, setContext] = React.useState(luigiClient.getContext());

  React.useEffect(() => {
    luigiClient.addContextUpdateListener(e => {
      setContext(e);
    });
  });

  return context;
}

const { Context, Provider } = createContainer(useLuigiContext);
export { Context as LuigiContext, Provider as LuigiContextProvider };
