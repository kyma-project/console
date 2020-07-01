import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useMicrofrontendContext } from 'react-shared';
import EventTriggers from 'shared/components/EventTriggers/EventTriggers';
import { useEventActivationsQuery } from 'components/Lambdas/gql/hooks/queries';
import { GET_EVENT_TRIGGERS } from 'components/Lambdas/gql/queries';
import {
  serializeEvents,
  createSubscriberRef,
  createOwnerRef,
} from 'components/Lambdas/helpers/eventTriggers';
import { useQuery } from '@apollo/react-hooks';
import { EVENT_TRIGGERS } from '../../constants';

import {
  useDeleteEventTrigger,
  useCreateManyEventTriggers,
} from 'components/Lambdas/gql/hooks/mutations';

export default function EventTriggersWrapper({ service }) {
  const { namespaceId: namespace } = useMicrofrontendContext();
  const subscriberRef = createSubscriberRef(service);
  const getEventTriggersVariables = {
    variables: {
      namespace,
      subscriber: subscriberRef,
    },
    fetchPolicy: 'network-only',
  };
  const mutationOptions = {
    refetchQueries: () => [
      {
        query: GET_EVENT_TRIGGERS,
        variables: getEventTriggersVariables.variables,
      },
    ],
  };

  const ownerRef = createOwnerRef({
    name: service.name,
    UID: service.UID,
    kind: EVENT_TRIGGERS.TYPE,
  });

  const createManyEventTriggers = useCreateManyEventTriggers(
    {
      name: service.name,
      namespace,
      subscriberRef,
      ownerRef,
    },
    mutationOptions,
  );
  const deleteEventTrigger = useDeleteEventTrigger(
    { name: service.name },
    mutationOptions,
  );

  const [
    events = [],
    activationsError,
    activationsLoading,
  ] = useEventActivationsQuery({
    namespace,
  });

  const { data, error: triggersError, loading: triggersLoading } = useQuery(
    GET_EVENT_TRIGGERS,
    getEventTriggersVariables,
  );

  const { availableEvents, usedEvents } = serializeEvents({
    events,
    eventTriggers: data.triggers,
  });

  return (
    <EventTriggers
      onTriggerDelete={deleteEventTrigger}
      onTriggersAdd={createManyEventTriggers}
      eventTriggers={usedEvents || []}
      availableEvents={availableEvents || []}
      serverDataError={!!(activationsError && triggersError)}
      serverDataLoading={!!(activationsLoading && triggersLoading)}
      notFoundMessage={EVENT_TRIGGERS.NOT_FOUND_MESSAGE}
    />
  );
}

EventTriggersWrapper.propTypes = {
  service: PropTypes.object.isRequired,
};
