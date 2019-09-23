import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { createBrowserHistory } from 'history';

import {
  NotificationMessage,
  Spinner,
  ThemeWrapper,
} from '@kyma-project/react-components';

import ServiceInstanceHeader from './ServiceInstanceHeader/ServiceInstanceHeader.component';
import ServiceInstanceTabs from './ServiceInstanceTabs/ServiceInstanceTabs.component';
import ServiceInstanceBindings from './ServiceInstanceBindings/ServiceInstanceBindings.container';

import { serviceInstanceConstants } from './../../variables';

import { ServiceInstanceWrapper, EmptyList } from './styled';
import { backendModuleExists } from '../../commons/helpers';
import builder from '../../commons/builder';
import { getServiceInstanceDetails } from '../../queries/queries';
import {
  SERVICE_BINDING_EVENT_SUBSCRIPTION,
  SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION,
} from '../../queries/subscriptions';
import {
  handleServiceBindingEvent,
  handleServiceBindingUsageEvent,
} from '../../store/ServiceInstances/events';
import { deleteServiceInstance } from '../../queries/mutations';

export default function ServiceInstanceDetails({ match }) {
  const history = createBrowserHistory();
  const { loading, error, data, subscribeToMore } = useQuery(
    getServiceInstanceDetails,
    {
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
        name: match.params.name,
      },
    },
  );

  subscribeToMore({
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
    document: SERVICE_BINDING_EVENT_SUBSCRIPTION,
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

  subscribeToMore({
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
    document: SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION,
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

  const [deleteServiceInstanceMutation] = useMutation(deleteServiceInstance);

  if (loading)
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  if (error)
    return (
      <EmptyList>
        An error occurred while loading Service Instance details
      </EmptyList>
    );

  const serviceInstance = data.serviceInstance;

  const serviceClass =
    serviceInstance &&
    (serviceInstance.serviceClass || serviceInstance.clusterServiceClass);

  return (
    <ThemeWrapper>
      <ServiceInstanceHeader
        serviceInstance={serviceInstance}
        deleteServiceInstance={deleteServiceInstanceMutation}
        history={history}
      />
      <ServiceInstanceWrapper>
        <ServiceInstanceBindings
          defaultActiveTabIndex={serviceInstanceConstants.addonsIndex}
          serviceInstance={serviceInstance}
        />
        {serviceClass &&
        backendModuleExists('cms') &&
        backendModuleExists('assetstore') ? (
          <ServiceInstanceTabs serviceClass={serviceClass} />
        ) : null}
      </ServiceInstanceWrapper>
      <NotificationMessage
        type="error"
        title={serviceInstanceConstants.error}
        message={error && error.message}
      />
    </ThemeWrapper>
  );
}
