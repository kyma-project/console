import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';
import ServiceClassPlansList from '../ServiceClassPlansList/ServiceClassPlansList';
import ServiceInstancesList from '../ServiceInstanceList/ServiceInstanceList';
import ServiceInstancesDetails from '../ServiceInstanceDetails/ServiceInstanceDetails';
import ServiceBrokers from '../ServiceBrokers/ServiceBrokers';
import { NotificationProvider, withWindowTitle } from 'react-shared';

const App = () => (
  <NotificationProvider>
    <Switch>
      <Route path="/preload" component={() => null} />

      <Route
        exact
        path="/catalog"
        component={withWindowTitle('Service Catalog', <ServiceClassList />)}
      />
      <Route
        exact
        path="/catalog/details/:name"
        component={RoutedCatalogDetails}
      />
      <Route
        exact
        path="/catalog/details/:name/plan/:plan"
        component={RoutedCatalogDetails}
      />
      <Route
        exact
        path="/catalog/details/:name/plans"
        component={RoutedServicePlanList}
      />

      <Route exact path="/instances" component={ServiceInstancesList} />
      <Route
        exact
        path="/instances/details/:name"
        component={withWindowTitle(
          'Service Instance',
          <ServiceInstancesDetails />,
        )}
      />

      <Route
        path="/brokers"
        component={withWindowTitle('Service Brokers', ServiceBrokers)}
      />
    </Switch>
  </NotificationProvider>
);

const RoutedCatalogDetails = ({ match }) =>
  withWindowTitle(
    'Serice Class',
    <ServiceClassDetails name={match.params.name} plan={match.params.plan} />,
  );

const RoutedServicePlanList = ({ match }) =>
  withWindowTitle(
    'Service Class Plans',
    <ServiceClassPlansList name={match.params.name} />,
  );

export default App;
