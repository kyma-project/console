import React from 'react';
import { BackendModuleDisabled } from '@kyma-project/react-components';

import Notification from '../components/Notification/container';
import Toolbar from '../components/Toolbar/Toolbar.component';
import Table from '../components/Table/Table.container';

import appInitializer from './app-initializer';
import {
  BACKEND_MODULE_SERVICE_CATALOG,
  BACKEND_MODULE_SERVICE_CATALOG_DISPLAY_NAME,
} from '../constants';

import { Wrapper } from './styled';

const App: React.FunctionComponent = () => {
  if (!appInitializer.backendModuleExists(BACKEND_MODULE_SERVICE_CATALOG)) {
    return (
      <BackendModuleDisabled
        mod={BACKEND_MODULE_SERVICE_CATALOG_DISPLAY_NAME}
      />
    );
  }

  return (
    <Wrapper>
      <Notification />
      <Toolbar />
      <Table />
    </Wrapper>
  );
};

export default App;
