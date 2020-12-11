import React from 'react';
import PropTypes from 'prop-types';
import { randomNamesGenerator } from '@kyma-project/common';

import { useMutation } from '@apollo/react-hooks';
import { GET_EVENT_SUBSCRIPTIONS } from 'gql/queries';
import { CREATE_EVENT_SUBSCRIPTION } from 'gql/mutations';

import { Modal, GenericList, useNotification } from 'react-shared';
import { Button } from 'fundamental-react';
import { SchemaComponent } from 'shared/components/EventTriggers/Schema/Schema';
import Checkbox from 'components/Lambdas/Checkbox/Checkbox';
import './CreateSubscriptionModal.scss';

function showCollapseControl(schema) {
  return !!(schema && schema.properties && !schema.anyOf);
}

CreateSubscriptionModal.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  owner: PropTypes.object.isRequired,
  namespaceId: PropTypes.string.isRequired,
  createResourceRef: PropTypes.func.isRequired,
};

export default function CreateSubscriptionModal({
  events: originalEvents,
  owner,
  namespaceId,
  createResourceRef,
}) {
  const notification = useNotification();
  const [createEventSubscription] = useMutation(CREATE_EVENT_SUBSCRIPTION);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    if (!originalEvents.length) return;
    originalEvents.sort((a, b) => a.eventType.localeCompare(b.eventType));
    setEvents(originalEvents.map(e => ({ ...e, isSelected: false })));
  }, [originalEvents]);

  function onSetCheckedEvents(event) {
    event.isSelected = !event.isSelected;
    setEvents([...events]);
  }

  const createSubscription = async () => {
    const filters = events
      .filter(e => e.isSelected)
      .map(e => ({
        applicationName: e.source,
        version: e.version,
        eventName: e.eventType,
      }));

    const variables = {
      name: `${owner.name}-${randomNamesGenerator()}`,
      namespace: namespaceId,
      params: {
        ownerRef: createResourceRef(owner),
        filters,
      },
    };

    try {
      await createEventSubscription({ variables });
      notification.notifySuccess({
        content: `Event subscription created`,
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Cannot create event subscription: ${e.message}`,
      });
    }
  };

  const headerRenderer = () => [
    '',
    '',
    '',
    'Event',
    'Version',
    'Application',
    'Description',
  ];

  const rowRenderer = entry => ({
    cells: [
      <Checkbox
        initialChecked={entry.isSelected}
        name={entry.uniqueID}
        onChange={_ => onSetCheckedEvents(entry)}
      />,
      null,
      entry.eventType,
      entry.version,
      entry.source,
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

  return (
    <Modal
      title="Create event subscription"
      modalOpeningComponent={
        <Button glyph="add" option="light">
          Create event subscription
        </Button>
      }
      confirmText="Save"
      cancelText="Cancel"
      disabledConfirm={events.every(e => !e.isSelected)}
      onConfirm={createSubscription}
    >
      <GenericList
        className="event-subscription-list"
        showSearchField={true}
        showSearchControl={false}
        showSearchSuggestion={false}
        textSearchProperties={['event', 'version', 'description', 'source']}
        entries={events}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        notFoundMessage="No events"
      />
    </Modal>
  );
}
