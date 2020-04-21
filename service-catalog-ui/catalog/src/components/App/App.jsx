import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Modal } from '@kyma-project/react-components';

import { NotificationProvider } from '../../../shared/contexts/NotificationContext';
import CatalogApp from '../../domains/catalog/components/App/App';
import InstancesApp from '../../domains/instances/App/App';

Modal.MODAL_APP_REF = '#root';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/catalog" component={CatalogApp} />
          <Route exact path="/instances" component={InstancesApp} />
        </Switch>
      </BrowserRouter>
    </NotificationProvider>
  );
}
