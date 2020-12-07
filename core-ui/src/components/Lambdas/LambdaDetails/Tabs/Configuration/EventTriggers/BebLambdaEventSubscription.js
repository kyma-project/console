import React from 'react';
import LuigiClient from '@luigi-project/client';
import {
  useMicrofrontendContext,
  GenericList,
  useNotification,
  easyHandleDelete,
} from 'react-shared';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_EVENT_SUBSCRIPTIONS } from 'gql/queries';
import { UPDATE_EVENT_SUBSCRIPTION } from 'gql/mutations';
import { useEventActivationsQuery } from 'components/Lambdas/gql';

import { ERRORS } from './../../../../constants';
import { createLambdaRef } from './helpers';
import { SchemaComponent } from 'shared/components/EventTriggers/Schema/Schema';
import CreateSubscriptionModal from './CreateSubscriptionModal';

function findFilterInEvents(filter, events) {
  return events.find(event =>
    filter.type.includes(event.uniqueID.replace('/', '.')),
  );
}

export default function BebLambdaEventSubscription({ lambda }) {
  const { namespaceId } = useMicrofrontendContext();
  const notification = useNotification();

  const [updateEventSubscription] = useMutation(UPDATE_EVENT_SUBSCRIPTION, {
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
    entries.sort((a, b) => a.eventType.localeCompare(b.eventType));
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
    cells: [
      entry.eventType,
      entry.version,
      <span
        className="link"
        onClick={() =>
          LuigiClient.linkManager().navigate(
            `/home/cmf-apps/details/${entry.source}`,
          )
        }
      >
        {entry.source}
      </span>,
      entry.description,
    ],
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
              .map(f =>
                events.find(event =>
                  f.eventType.property.includes(
                    event.uniqueID.replace('/', '.'),
                  ),
                ),
              )
              .map(e => ({
                applicationName: e.source,
                version: e.version,
                eventName: e.eventType,
              })),
          },
        };

        easyHandleDelete(
          'Event',
          entry.eventType,
          updateEventSubscription,
          { variables },
          'updateSubscription',
          notification,
        );
      },
    },
  ];

  const allFilters = (data.subscriptions || []).flatMap(sub =>
    sub.spec.filter.filters.map(filter => filter.eventType.property),
  );

  const modalEvents = (events || []).filter(
    event =>
      !allFilters.find(f => f.includes(event.uniqueID.replace('/', '.'))),
  );

  const createSubscription = (
    <CreateSubscriptionModal
      events={modalEvents}
      namespaceId={namespaceId}
      owner={lambda}
    />
  );

  return (
    <GenericList
      title="Event subscriptions"
      textSearchProperties={textSearchProperties}
      showSearchSuggestion={false}
      extraHeaderContent={createSubscription}
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
