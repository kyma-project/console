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

import {
  useDeleteEventTrigger,
  useCreateManyEventTriggers,
} from 'components/Lambdas/gql/hooks/mutations';
// import { CONFIG } from '../../Lambdas/config';

export default function EventTriggersWrapper({ service }) {
  // const deleteEventTrigger = useDeleteEventTrigger({ lambda });
  // const createManyEventTriggers = useCreateManyEventTriggers({ lambda });
  const subscriberRef = createSubscriberRef(service);
  const ownerRef = createOwnerRef({
    name: service.name,
    UID: service.UID,
    kind: 'Service',
  });
  const { namespaceId: namespace } = useMicrofrontendContext();
  const createManyEventTriggers = useCreateManyEventTriggers({
    name: service.name,
    namespace,
    subscriberRef,
    ownerRef,
  });

  const [
    events = [],
    activationsError,
    activationsLoading,
  ] = useEventActivationsQuery({
    namespace,
  });

  //TODO: get list of event triggers for the service to mark them as selected
  // const [
  //   eventTriggers = [],
  //   triggersError,
  //   triggersLoading,
  // ] = useEventTriggersQuery({
  //   subscriber: createSubscriberRef(lambda),
  //   // lambda,
  // });
  // const ref= {ref: {
  //     apiVersion: CONFIG.triggerSubscriber.apiVersion,
  //     kind: CONFIG.triggerSubscriber.kind,
  //     name: lambda.name || '',
  //     namespace: lambda.namespace || '',
  //   }},

  const { data, error, loading } = useQuery(GET_EVENT_TRIGGERS, {
    variables: {
      namespace,
      subscriber: subscriberRef,
    },
    fetchPolicy: 'network-only',
  });

  const { availableEvents, usedEvents } = serializeEvents({
    events,
    eventTriggers: data.triggers,
  });

  console.log(data);

  function handleTriggerDelete(trigger) {
    //TODO
  }

  function handleTriggersAdd(triggers) {
    //TODO
  }

  return (
    <EventTriggers
      onTriggerDelete={handleTriggerDelete}
      onTriggersAdd={createManyEventTriggers}
      eventTriggers={usedEvents || []}
      availableEvents={availableEvents || []}
      serverDataError={!!activationsError}
      serverDataLoading={!!activationsLoading}
    />
  );
}

EventTriggersWrapper.propTypes = {
  service: PropTypes.object.isRequired,
};
