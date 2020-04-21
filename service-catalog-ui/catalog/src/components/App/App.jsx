import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Modal } from '@kyma-project/react-components';

import { NotificationProvider } from '../../react-shared';
import CatalogApp from '../../domains/catalog/components/App/App';
import InstancesApp from '../../domains/instances/components/App/App';

Modal.MODAL_APP_REF = '#root';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/catalog">
            <CatalogApp />
          </Route>
          <Route exact path="/instances">
            <InstancesApp />
          </Route>
        </Switch>
      </BrowserRouter>
    </NotificationProvider>
  );
}
