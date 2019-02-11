import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

import { SERVICE_INSTANCES_QUERY } from './queries';
import {
  SERVICE_INSTANCE_EVENT_SUBSCRIPTION,
  SERVICE_BINDING_EVENT_SUBSCRIPTION,
  SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION,
} from './subscriptions';
import {
  handleInstanceEvent,
  handleServiceBindingEvent,
  handleServiceBindingUsageEvent,
} from '../../store/ServiceInstances/events';
import builder from '../../commons/builder';
import { backendModuleExists } from '../../commons/helpers';

const DataProvider = ({ serviceInstances, children }) => {
  const subscribeToEvents = () => {
    const serviceCatalogAddonsBackendModuleExists = backendModuleExists(
      'servicecatalogaddons',
    );

    if (!serviceInstances) {
      return;
    }

    serviceInstances.subscribeToMore({
      document: SERVICE_INSTANCE_EVENT_SUBSCRIPTION,
      variables: { namespace: builder.getCurrentEnvironmentId() },
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          !subscriptionData.data.serviceInstanceEvent
        ) {
          return prev;
        }

        return handleInstanceEvent(
          prev,
          subscriptionData.data.serviceInstanceEvent,
        );
      },
    });

    serviceInstances.subscribeToMore({
      document: SERVICE_BINDING_EVENT_SUBSCRIPTION,
      variables: { namespace: builder.getCurrentEnvironmentId() },
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          !subscriptionData.data.serviceBindingEvent
        ) {
          return prev;
        }

        return handleServiceBindingEvent(
          prev,
          subscriptionData.data.serviceBindingEvent,
        );
      },
    });

    if (!serviceCatalogAddonsBackendModuleExists) {
      return;
    }

    serviceInstances.subscribeToMore({
      document: SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION,
      variables: { namespace: builder.getCurrentEnvironmentId() },
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          !subscriptionData.data.serviceBindingUsageEvent
        ) {
          return prev;
        }

        return handleServiceBindingUsageEvent(
          prev,
          subscriptionData.data.serviceBindingUsageEvent,
        );
      },
    });
  };

  return children({
    serviceInstances,
    subscribeToEvents: subscribeToEvents,
  });
};

DataProvider.propTypes = {
  children: PropTypes.func.isRequired,
  serviceInstances: PropTypes.object,
};

export default compose(
  graphql(SERVICE_INSTANCES_QUERY, {
    name: 'serviceInstances',
    options: () => ({
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
      },
    }),
  }),
)(DataProvider);
