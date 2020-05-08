import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ServiceClassList from '../ServiceClassList/ServiceClassList';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails';
import ServiceClassPlansList from '../ServiceClassPlansList/ServiceClassPlansList';
import ServiceInstancesList from '../ServiceInstancesList/ServiceInstancesList';
import ServiceInstancesDetails from '../ServiceInstanceDetails/ServiceInstanceDetails';
import { NotificationProvider } from 'react-shared';

const App = () => (
  <NotificationProvider>
    <Switch>
      <Route path="/preload" component={() => null} />

      <Route
        path="/catalog"
        component={({ match }) => {
          const { path: base } = match;
          return (
            <>
              <Route exact path={base + '/'} component={ServiceClassList} />
              <Route
                exact
                path={base + '/details/:name'}
                component={RoutedCatalogDetails}
              />
              <Route
                exact
                path={base + '/details/:name/plan/:plan'}
                component={RoutedCatalogDetails}
              />
              <Route
                exact
                path={base + '/details/:name/plans'}
                component={RoutedServicePlanList}
              />
            </>
          );
        }}
      />

      <Route
        path="/instances"
        component={({ match }) => {
          const { path: base } = match;
          return (
            <>
              <Route exact path={base + '/'} component={ServiceInstancesList} />
              <Route
                exact
                path={base + '/details/:name'}
                component={ServiceInstancesDetails}
              />
            </>
          );
        }}
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
