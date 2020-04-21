import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Modal } from '@kyma-project/react-components';

import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';
import ServiceClassPlansList from '../ServiceClassPlansList/ServiceClassPlansList';

Modal.MODAL_APP_REF = '#root';

const ServiceDetails = ({ match }) => (
  <ServiceClassDetails name={match.params.name} plan={match.params.plan} />
);

const ServicePlans = ({ match }) => (
  <ServiceClassPlansList name={match.params.name} />
);

export default function App() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/details/:name`} component={ServiceDetails} />
      <Route
        exact
        path={`${path}/details/:name/plan/:plan`}
        component={ServiceDetails}
      />
      <Route
        exact
        path={`${path}/details/:name/plans`}
        component={ServicePlans}
      />
      <Route component={ServiceClassList} />
    </Switch>
  );
}
