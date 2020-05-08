import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';
import ServiceClassPlansList from '../ServiceClassPlansList/ServiceClassPlansList';
import { NotificationProvider } from 'react-shared';

const App = () => (
  <NotificationProvider>
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route exact path="/" component={ServiceClassList} />
      <Route exact path="/details/:name" component={RoutedCatalogDetails} />
      <Route
        exact
        path="/details/:name/plan/:plan"
        component={RoutedCatalogDetails}
      />
      <Route
        exact
        path="/details/:name/plans"
        component={RoutedServicePlanList}
      />
    </Switch>
  </NotificationProvider>
);

const RoutedCatalogDetails = ({ match }) => (
  <ServiceClassDetails name={match.params.name} plan={match.params.plan} />
);

const RoutedServicePlanList = ({ match }) => (
  <ServiceClassPlansList name={match.params.name} />
);

export default App;
