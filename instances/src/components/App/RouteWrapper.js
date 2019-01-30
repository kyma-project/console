import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotificationMessage, Spinner } from '@kyma-project/react-components';

import ServiceInstances from '../ServiceInstances/ServiceInstances.container';
import ServiceInstanceDetails from '../ServiceInstanceDetails/ServiceInstanceDetails.container';
import { EmptyList } from '../ServiceInstanceDetails/styled';

class RouteWrapper extends React.Component {
  componentDidMount() {
    if (typeof this.props.subscribeToEvents === 'function') {
      this.props.subscribeToEvents();
    }
  }

  render() {
    const { serviceInstances } = this.props;
    if (serviceInstances.loading) {
      return (
        <EmptyList>
          <Spinner />
        </EmptyList>
      );
    }

    if (serviceInstances.error) {
      return (
        <NotificationMessage
          type="error"
          title="Error"
          message={serviceInstances.error && serviceInstances.error.message}
        />
      );
    }

    return (
      <Fragment>
        <Switch>
          <Route exact path="/" component={ServiceInstances} />
          <Route
            exact
            path="/details/:name"
            component={ServiceInstanceDetails}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default RouteWrapper;
