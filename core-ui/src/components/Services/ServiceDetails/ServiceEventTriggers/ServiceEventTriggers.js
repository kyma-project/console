// import React from 'react';
// import PropTypes from 'prop-types';

// import { useMicrofrontendContext } from 'react-shared';
// import EventSubscriptions from 'shared/components/EventSubscriptions/EventSubscriptions';
// import {
//   useEventActivationsQuery,
//   useEventTriggersQuery,
// } from 'components/Lambdas/gql/hooks/queries';
// import { GET_EVENT_TRIGGERS } from 'components/Lambdas/gql/queries';
// import { serializeEvents } from 'components/Lambdas/helpers/eventTriggers';
// import { EVENT_TRIGGERS, SERVICE_API_VERSION } from '../../constants';

// import {
//   useDeleteEventTrigger,
//   useCreateManyEventTriggers,
// } from 'components/Lambdas/gql/hooks/mutations';

// export default function ServiceEventTriggersWrapper({ service }) {
//   const { namespaceId: namespace } = useMicrofrontendContext();
//   const subscriberRef = {
//     ref: {
//       name: service.name,
//       namespace,
//       kind: 'Service',
//       apiVersion: 'v1',
//     },
//   };

//   const ownerRef = {
//     apiVersion: SERVICE_API_VERSION,
//     kind: 'Service',
//     name: service.name,
//     UID: service.UID,
//   };

//   const mutationOptions = {
//     refetchQueries: () => [
//       {
//         query: GET_EVENT_TRIGGERS,
//         variables: {
//           namespace,
//           serviceName: service.name,
//         },
//       },
//     ],
//   };

//   const createManyEventTriggers = useCreateManyEventTriggers(
//     {
//       name: service.name,
//       namespace,
//       subscriberRef,
//       ownerRef,
//     },
//     mutationOptions,
//   );
//   const deleteEventTrigger = useDeleteEventTrigger(
//     { name: service.name },
//     mutationOptions,
//   );

//   const [
//     events = [],
//     activationsError,
//     activationsLoading,
//   ] = useEventActivationsQuery({
//     namespace,
//   });

//   const [
//     eventTriggers = [],
//     triggersError,
//     triggersLoading,
//   ] = useEventTriggersQuery({
//     namespace,
//     serviceName: service.name,
//   });

//   const { availableEvents, usedEvents } = serializeEvents({
//     events,
//     eventTriggers,
//   });

//   const servicePorts =
//     service.json.spec.ports && service.json.spec.ports.map(port => port.port);

//   return (
//     <EventSubscriptions
//       servicePorts={servicePorts}
//       onTriggerDelete={deleteEventTrigger}
//       onTriggersAdd={createManyEventTriggers}
//       eventTriggers={usedEvents || []}
//       availableEvents={availableEvents || []}
//       serverDataError={!!(activationsError && triggersError)}
//       serverDataLoading={!!(activationsLoading && triggersLoading)}
//       notFoundMessage={EVENT_TRIGGERS.NOT_FOUND_MESSAGE}
//     />
//   );
// }

// ServiceEventTriggersWrapper.propTypes = {
//   service: PropTypes.object.isRequired,
// };
