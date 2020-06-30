import React from 'react';
import PropTypes from 'prop-types';

import EventTriggers from 'shared/components/EventTriggers/EventTriggers';
import {
  useEventActivationsQuery,
  useEventTriggersQuery,
} from 'components/Lambdas/gql/hooks/queries';

import {
  useDeleteEventTrigger,
  useCreateManyEventTriggers,
} from 'components/Lambdas/gql/hooks/mutations';
import {
  serializeEvents,
  createSubscriberRef,
} from 'components/Lambdas/helpers/eventTriggers';

export default function EventTriggersWrapper({ lambda }) {
  const deleteEventTrigger = useDeleteEventTrigger({ lambda });
  const createManyEventTriggers = useCreateManyEventTriggers({ lambda });

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
    subscriber: createSubscriberRef(lambda),
    lambda,
  });

  const { availableEvents, usedEvents } = serializeEvents({
    events,
    eventTriggers,
  });

  return (
    <EventTriggers
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
