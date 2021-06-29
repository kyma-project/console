import React from 'react';
import LuigiClient from '@luigi-project/client';
import {
  GenericList,
  useNotification,
  easyHandleDelete,
  handleSubscriptionArrayEvent,
  useMicrofrontendContext,
} from 'react-shared';

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { GET_EVENT_SUBSCRIPTIONS } from 'gql/queries';
import { UPDATE_EVENT_SUBSCRIPTION } from 'gql/mutations';
import { EVENT_SUBSCRIPTION_SUBSCRIPTION } from 'gql/subscriptions';
import { useEventActivationsQuery } from 'components/Lambdas/gql';

import { ERRORS } from './../../../components/Lambdas/constants';
import { SchemaComponent } from 'shared/components/EventTriggers/Schema/Schema';
import CreateSubscriptionModal from './CreateSubscriptionModal';

function findFilterInEvents(filter, events) {
  return events.find(event =>
    filter.type.includes(event.uniqueID.replace('/', '.')),
  );
}

const textSearchProperties = ['eventType', 'version', 'source', 'description'];

function headerRenderer() {
  return ['', 'Event', 'Version', 'Application', 'Description'];
}

function showCollapseControl(schema) {
  return !!(schema && schema.properties && !schema.anyOf);
}

export default function BebEventSubscription({ resource, createResourceRef }) {
  const { namespaceId } = useMicrofrontendContext();
  const notification = useNotification();
  const [eventSubscriptions, setEventSubscriptions] = React.useState([]);
  const [entries, setEntries] = React.useState([]);

  useSubscription(EVENT_SUBSCRIPTION_SUBSCRIPTION, {
    variables: { namespace: namespaceId, ownerName: resource.name },
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        type,
        subscription,
      } = subscriptionData.data.subscriptionSubscription; // hmm
      handleSubscriptionArrayEvent(
        eventSubscriptions,
        setEventSubscriptions,
        type,
        subscription,
      );
    },
  });

  const [updateEventSubscription] = useMutation(UPDATE_EVENT_SUBSCRIPTION);
  const { error, loading } = useQuery(GET_EVENT_SUBSCRIPTIONS, {
    variables: {
      ownerName: resource.name,
      namespace: namespaceId,
    },
    onCompleted: data => setEventSubscriptions(data.eventSubscriptions),
  });

  const [
    events,
    activationsError,
    activationsLoading,
  ] = useEventActivationsQuery({
    namespace: namespaceId,
  });

  React.useEffect(() => {
    if (!events.length) return;

    const filters = eventSubscriptions.flatMap(subscription =>
      subscription.spec.filter.filters.map(filter => ({
        subscriptionName: subscription.name,
        type: filter.eventType.value,
      })),
    );
    const entries = filters
      .filter(filter => findFilterInEvents(filter, events))
      .map(filter => ({
        ...findFilterInEvents(filter, events),
        subscriptionName: filter.subscriptionName,
      }));
    entries.sort((a, b) => a.eventType.localeCompare(b.eventType));
    setEntries(entries);
  }, [eventSubscriptions, events]);

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
        const subscription = eventSubscriptions.find(
          s => s.name === entry.subscriptionName,
        );
        const newFilters = subscription.spec.filter.filters.filter(
          f => !f.eventType.value.includes(entry.uniqueID.replace('/', '.')),
        );

        const variables = {
          name: subscription.name,
          namespace: namespaceId,
          params: {
            ownerRef: createResourceRef(resource),
            filters: newFilters
              .map(f =>
                events.find(event =>
                  f.eventType.value.includes(event.uniqueID.replace('/', '.')),
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

  const allFilters = eventSubscriptions.flatMap(sub =>
    sub.spec.filter.filters.map(filter => filter.eventType.value),
  );

  const modalEvents = events.filter(
    event =>
      !allFilters.find(f => f.includes(event.uniqueID.replace('/', '.'))),
  );

  const createSubscription = (
    <CreateSubscriptionModal
      events={modalEvents}
      namespaceId={namespaceId}
      owner={resource}
      createResourceRef={createResourceRef}
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
