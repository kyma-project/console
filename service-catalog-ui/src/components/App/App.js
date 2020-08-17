import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';
import ServiceClassPlansList from '../ServiceClassPlansList/ServiceClassPlansList';
import ServiceInstancesList from '../ServiceInstanceList/ServiceInstanceList';
import ServiceInstancesDetails from '../ServiceInstanceDetails/ServiceInstanceDetails';
import ServiceBrokers from '../ServiceBrokers/ServiceBrokers';
import { NotificationProvider, withTitle } from 'react-shared';

const App = () => (
  <NotificationProvider>
    <Switch>
      <Route path="/preload" component={() => null} />

      <Route
        exact
        path="/catalog"
        render={withTitle('Catalog', ServiceClassList)}
      />

      <Route
        exact
        path="/catalog/details/:name"
        render={withTitle('Catalog', RoutedCatalogDetails)}
      />
      <Route
        exact
        path="/catalog/details/:name/plan/:plan"
        render={withTitle('Catalog', RoutedCatalogDetails)}
      />
      <Route
        exact
        path="/catalog/details/:name/plans"
        render={withTitle('Catalog', RoutedServicePlanList)}
      />

      <Route
        exact
        path="/instances"
        render={withTitle('Instances', ServiceInstancesList)}
      />
      <Route
        exact
        path="/instances/details/:name"
        render={withTitle('Instance', ServiceInstancesDetails)}
      />

      <Route
        path="/brokers"
        render={withTitle('Service Brokers', ServiceBrokers)}
      />
    </Switch>
  </NotificationProvider>
);

const RoutedCatalogDetails = ({ match }) => (
  <ServiceClassDetails name={match.params.name} plan={match.params.plan} />
);

const RoutedServicePlanList = ({ match }) =>
  withTitle('Catalog', <ServiceClassPlansList name={match.params.name} />);

export default App;
