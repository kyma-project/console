import React, { useEffect } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { createBrowserHistory } from 'history';

import {
  NotificationMessage,
  Spinner,
  ThemeWrapper,
} from '@kyma-project/react-components';

import ServiceInstanceHeader from './ServiceInstanceHeader/ServiceInstanceHeader';
import ServiceInstanceTabs from './ServiceInstanceTabs/ServiceInstanceTabs.component';
import ServiceInstanceBindings from './ServiceInstanceBindings/ServiceInstanceBindings.container';
import { serviceInstanceConstants } from 'helpers/constants';

import { ServiceInstanceWrapper, EmptyList } from './styled';
import { backendModuleExists } from 'helpers';
import builder from 'builder';
import { getServiceInstanceDetails } from 'helpers/instancesGQL/queries';
import {
  SERVICE_BINDING_EVENT_SUBSCRIPTION,
  SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION,
  SERVICE_INSTANCE_EVENT_SUBSCRIPTION,
} from 'helpers/instancesGQL/subscriptions';
import {
  handleInstanceEventOnDetails,
  handleServiceBindingEvent,
  handleServiceBindingUsageEvent,
} from 'helpers/instancesGQL/events';
import { deleteServiceInstance } from 'helpers/instancesGQL/mutations';

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

  useEffect(() => {
    return subscribeToMore({
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
  }, [subscribeToMore]);

  useEffect(() => {
    return subscribeToMore({
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
  }, [subscribeToMore]);

  useEffect(() => {
    return subscribeToMore({
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
      },
      document: SERVICE_INSTANCE_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          !subscriptionData.data.serviceInstanceEvent
        ) {
          return prev;
        }

        return handleInstanceEventOnDetails(
          prev,
          subscriptionData.data.serviceInstanceEvent,
        );
      },
    });
  }, [subscribeToMore]);

  const [deleteServiceInstanceMutation] = useMutation(deleteServiceInstance);

  if (error)
    return (
      <EmptyList>
        An error occurred while loading Service Instance details
      </EmptyList>
    );

  if (loading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  const { serviceInstance } = data;
  const serviceClass =
    serviceInstance &&
    (serviceInstance.serviceClass || serviceInstance.clusterServiceClass);

  return (
    <ThemeWrapper>
      <ServiceInstanceHeader
        serviceInstance={serviceInstance}
        instanceClass={serviceClass}
        deleteServiceInstance={deleteServiceInstanceMutation}
        history={history}
      />
      <ServiceInstanceWrapper>
        <ServiceInstanceBindings
          defaultActiveTabIndex={serviceInstanceConstants.addonsIndex}
          serviceInstance={serviceInstance}
        />
        {serviceClass && backendModuleExists('rafter') && (
          <ServiceInstanceTabs
            serviceClass={serviceClass}
            currentPlan={serviceInstance.servicePlan}
          />
        )}
      </ServiceInstanceWrapper>
      <NotificationMessage
        type="error"
        title={serviceInstanceConstants.error}
        message={error && error.message}
      />
    </ThemeWrapper>
  );
}
