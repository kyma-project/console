import React from 'react';
import PropTypes from 'prop-types';
import { randomNamesGenerator } from '@kyma-project/common';

import { useMutation } from '@apollo/react-hooks';
import { CREATE_EVENT_SUBSCRIPTION } from 'gql/mutations';

import { Modal, GenericList, useNotification } from 'react-shared';
import { Button } from 'fundamental-react';
import { SchemaComponent } from 'shared/components/EventTriggers/Schema/Schema';
import { EVENT_SUBSCRIPTION_PANEL } from 'shared/constants';
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
        content: EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.NOTIFICATION.SUCCESS,
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `${EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.NOTIFICATION.ERROR} ${e.message}`,
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
      title={EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.OPEN_BUTTON.TITLE}
      modalOpeningComponent={
        <Button glyph="add" option="light">
          {EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT}
        </Button>
      }
      confirmText={EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT}
      cancelText={EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.CANCEL_BUTTON.TEXT}
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
