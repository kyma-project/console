import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Modal, BackendModuleDisabled } from '@kyma-project/react-components';

import ServiceClassList from '../ServiceClassList/ServiceClassList.component';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails.component';

import { backendModuleExists } from '../../commons/helpers';

Modal.MODAL_APP_REF = '#root';

export default function App() {
  return (
    <div className="ph3 pv1 background-gray">
      {backendModuleExists('servicecatalog') ? (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={ServiceClassList} />
            <Route
              exact
              path="/details/:name"
              component={ServiceClassDetails}
            />
          </Switch>
        </BrowserRouter>
      ) : (
        <BackendModuleDisabled mod="Service Catalog" />
      )}
    </div>
  );
}
