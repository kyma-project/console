import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Modal, BackendModuleDisabled } from '@kyma-project/react-components';

import { NotificationProvider } from '../../shared/contexts/NotificationContext';
import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';
import ServiceClassPlansList from '../ServiceClassPlansList/ServiceClassPlansList';

import { backendModuleExists } from '../../commons/helpers';

Modal.MODAL_APP_REF = '#root';

const ServiceDetails = ({ match }) => (
  <ServiceClassDetails name={match.params.name} />
);

const ServiceDetailsWithPlan = ({ match }) => (
  <ServiceClassDetails name={match.params.name} plan={match.params.plan} />
);

const ServicePlans = ({ match }) => (
  <ServiceClassPlansList name={match.params.name} />
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
              <Route
                exact
                path="/details/:name/plan/:plan"
                component={ServiceDetailsWithPlan}
              />
              <Route exact path="/plans/:name" component={ServicePlans} />
            </Switch>
          </BrowserRouter>
        </NotificationProvider>
      ) : (
        <BackendModuleDisabled mod="Service Catalog" />
      )}
    </>
  );
}
