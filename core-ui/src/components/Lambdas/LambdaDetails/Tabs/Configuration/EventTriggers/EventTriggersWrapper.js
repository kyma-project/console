import React from 'react';
import PropTypes from 'prop-types';

import EventTriggers from 'shared/components/EventTriggers/EventTriggers';
import {
  useEventActivationsQuery,
  useEventTriggersQuery,
} from 'components/Lambdas/gql/hooks/queries';
import {
  SERVERLESS_API_VERSION,
  SERVERLESS_RESOURCE_KIND,
} from '../../../../constants';

import {
  useDeleteEventTrigger,
  useCreateManyEventTriggers,
} from 'components/Lambdas/gql/hooks/mutations';
import {
  serializeEvents,
  createSubscriberRef,
} from 'components/Lambdas/helpers/eventTriggers';

export default function EventTriggersWrapper({ lambda }) {
  const subscriberRef = createSubscriberRef(lambda);

  const ownerRef = {
    apiVersion: SERVERLESS_API_VERSION,
    kind: SERVERLESS_RESOURCE_KIND,
    name: lambda.name,
    UID: lambda.UID,
  };

  const deleteEventTrigger = useDeleteEventTrigger(lambda);
  const createManyEventTriggers = useCreateManyEventTriggers({
    ...lambda,
    subscriberRef,
    ownerRef,
  });

  const [
    events = [],
    activationsError,
    activationsLoading,
  ] = useEventActivationsQuery({
    namespace: lambda.namespace,
  });
  const [
    eventTriggers = [],
    triggersError,
    triggersLoading,
  ] = useEventTriggersQuery({
    namespace: lambda.namespace,
    serviceName: lambda.name,
  });

  const { availableEvents, usedEvents } = serializeEvents({
    events,
    eventTriggers,
  });

  return (
    <EventTriggers
      isLambda={true}
      onTriggerDelete={deleteEventTrigger}
      onTriggersAdd={createManyEventTriggers}
      eventTriggers={usedEvents || []}
      availableEvents={availableEvents || []}
      serverDataError={activationsError || triggersError || false}
      serverDataLoading={activationsLoading || triggersLoading || false}
    />
  );
}

EventTriggersWrapper.propTypes = {
  lambda: PropTypes.object.isRequired,
};
