import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Modal, BackendModuleDisabled } from '@kyma-project/react-components';

import { NotificationProvider } from '../../shared/contexts/NotificationContext';
import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';

import { backendModuleExists } from '../../commons/helpers';

Modal.MODAL_APP_REF = '#root';
// app
const ServiceDetails = ({ match }) => (
  <ServiceClassDetails name={match.params.name} />
);

export default function App() {
  return (
    <>
      {backendModuleExists('servicecatalog') ? (
        <NotificationProvider>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ServiceClassList} />
              <Route exact path="/details/:name" component={ServiceDetails} />
            </Switch>
          </BrowserRouter>
        </NotificationProvider>
      ) : (
        <BackendModuleDisabled mod="Service Catalog" />
      )}
    </>
  );
}
