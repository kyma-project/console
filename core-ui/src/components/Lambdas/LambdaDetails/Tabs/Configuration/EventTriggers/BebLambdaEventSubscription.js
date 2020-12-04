import React from 'react';
import {
  useMicrofrontendContext,
  GenericList,
  useNotification,
} from 'react-shared';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_EVENT_SUBSCRIPTIONS } from 'gql/queries';
import { UPDATE_EVENT_SUBCRIPTION } from 'gql/mutations';
import { useEventActivationsQuery } from 'components/Lambdas/gql';

import {
  ERRORS,
  SERVERLESS_API_VERSION,
  SERVERLESS_RESOURCE_KIND,
} from './../../../../constants';
import { SchemaComponent } from 'shared/components/EventTriggers/Schema/Schema';

function findFilterInEvents(filter, events) {
  return events.find(event =>
    filter.type.includes(event.uniqueID.replace('/', '.')),
  );
}

function createOwnerRef(apiVersion, kind, entry) {
  return {
    apiVersion,
    kind,
    name: entry.name,
    UID: entry.UID,
  };
}

function createLambdaRef(lambda) {
  return createOwnerRef(
    SERVERLESS_API_VERSION,
    SERVERLESS_RESOURCE_KIND,
    lambda,
  );
}

export default function BebLambdaEventSubscription({ lambda }) {
  const { namespaceId } = useMicrofrontendContext();
  const notification = useNotification();

  const [updateEventSubscription] = useMutation(UPDATE_EVENT_SUBCRIPTION);
  const { data, error, loading } = useQuery(GET_EVENT_SUBSCRIPTIONS, {
    variables: {
      ownerName: lambda.name,
      namespace: namespaceId,
    },
  });

  const [
    events,
    activationsError,
    activationsLoading,
  ] = useEventActivationsQuery({
    namespace: namespaceId,
  });

  let entries = [];
  if (data.eventSubscriptions && events.length) {
    const subscriptions = data.eventSubscriptions.flatMap(subscription =>
      subscription.spec.filter.filters.map(filter => ({
        name: subscription.name,
        type: filter.eventType.property,
      })),
    );

    entries = subscriptions.map(filter => ({
      ...findFilterInEvents(filter, events),
      subscriptionName: filter.name,
    }));
  }

  const textSearchProperties = [
    'eventType',
    'version',
    'source',
    'description',
  ];

  const headerRenderer = () => [
    '',
    'Event',
    'Version',
    'Application',
    'Description',
  ];

  function showCollapseControl(schema) {
    return !!(schema && schema.properties && !schema.anyOf);
  }

  const rowRenderer = entry => ({
    cells: [entry.eventType, entry.version, entry.source, entry.description],
    collapseContent: (
      <>
        <td></td>
        <td colSpan="6">
          <SchemaComponent schema={entry.schema} />
        </td>
        <td></td>
      </>
    ),
    showCollapseControl: showCollapseControl(entry.schema),
    withCollapseControl: true,
  });

  const actions = [
    {
      name: 'Delete',
      handler: async entry => {
        const subscription = data.eventSubscriptions.find(
          s => s.name === entry.subscriptionName,
        );
        const newFilters = subscription.spec.filter.filters.filter(
          f => !f.eventType.property.includes(entry.uniqueID.replace('/', '.')),
        );

        const variables = {
          name: subscription.name,
          namespace: namespaceId,
          params: {
            ownerRef: createLambdaRef(lambda),
            filters: newFilters
              .map(f => findFilterInEvents(f, events))
              .map(e => ({
                applicationName: e.source,
                version: e.version,
                eventName: e.eventType,
              })),
          },
        };

        try {
          await updateEventSubscription({
            variables,
            refetchQueries: () => [
              {
                query: GET_EVENT_SUBSCRIPTIONS,
                variables: {
                  ownerName: lambda.name,
                  namespace: namespaceId,
                },
              },
            ],
          });
          notification.notifySuccess({
            content: `Event subscription updated`,
          });
        } catch (e) {
          console.warn(e);
          notification.notifyError({
            content: `Cannot update event subscription: ${e.message}`,
          });
        }
      },
    },
  ];

  return (
    <GenericList
      title="Event subscriptions"
      textSearchProperties={textSearchProperties}
      showSearchSuggestion={false}
      //   extraHeaderContent={createEventTrigger}
      actions={actions}
      entries={entries}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error || activationsError}
      serverDataLoading={loading || activationsLoading}
      notFoundMessage="No event subscriptions"
      serverErrorMessage={ERRORS.SERVER}
    />
  );
}
