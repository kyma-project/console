import React from 'react';
import PropTypes from 'prop-types';

import EventTriggers from './EventTriggers';
import {
  useEventActivationsQuery,
  useEventTriggersQuery,
} from '../../../../gql/hooks/queries';
import {
  serializeEvents,
  createSubscriberRef,
} from '../../../../helpers/eventTriggers';

export default function EventTriggersWrapper({ lambda }) {
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

  const [availableEvents, usedEvents] = serializeEvents(events, eventTriggers);

  return (
    <EventTriggers
      lambda={lambda}
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
