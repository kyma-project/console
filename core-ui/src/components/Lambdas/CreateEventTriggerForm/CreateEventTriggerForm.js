import React, { useState, useEffect } from 'react';
import { GenericList } from 'react-shared';

import Checkbox from '../Checkbox/Checkbox';
import { useCreateManyEventTriggers } from '../gql/hooks/mutations';

import { SchemaComponent } from '../LambdaDetails/Tabs/Configuration/EventTriggers/Schema/Schema';

import './CreateEventTriggerForm.scss';

export default function CreateEventTriggerForm({
  lambda,
  availableEvents = [],
  formElementRef,
  setValidity = () => void 0,
}) {
  const createManyEventTriggers = useCreateManyEventTriggers({ lambda });
  const [checkedEvents, setCheckedEvents] = useState([]);

  useEffect(() => {
    setValidity(false);
  }, [setValidity]);

  useEffect(() => {
    setValidity(!!checkedEvents.length);
  }, [checkedEvents, setValidity]);

  function isChecked(event) {
    return checkedEvents.some(e => event.uniqueID === e.uniqueID);
  }

  function onSetCheckedEvents(event) {
    if (isChecked(event)) {
      setCheckedEvents(collection =>
        collection.filter(entry => entry.uniqueID !== event.uniqueID),
      );
    } else {
      setCheckedEvents(collection => [...collection, event]);
    }
  }

  function showCollapseControl(schema) {
    return !!(schema && schema.properties && !schema.anyOf);
  }

  const headerRenderer = () => [
    '',
    '',
    'Event',
    'Version',
    'Source / Application',
    'Description',
  ];
  const rowRenderer = event => ({
    cells: [
      <Checkbox
        initialChecked={isChecked(event)}
        name={event.uniqueID}
        onChange={_ => onSetCheckedEvents(event)}
      />,
      <span data-test-id="event-trigger-type">{event.eventType}</span>,
      <span data-test-id="event-trigger-version">{event.version}</span>,
      <span data-test-id="event-trigger-source">{event.source}</span>,
      <span data-test-id="event-trigger-description">{event.description}</span>,
    ],
    collapseContent: (
      <>
        <td></td>
        <td></td>
        <td colSpan="4">
          <SchemaComponent schema={event.schema} />
        </td>
      </>
    ),
    showCollapseControl: showCollapseControl(event.schema),
  });
  const textSearchProperties = [
    'eventType',
    'version',
    'source',
    'description',
  ];

  async function handleSubmit() {
    await createManyEventTriggers(checkedEvents);
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      className="create-event-trigger-form"
    >
      <GenericList
        showSearchField={true}
        textSearchProperties={textSearchProperties}
        entries={availableEvents}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        hasExternalMargin={false}
        showSearchControl={false}
        showSearchSuggestion={false}
      />
    </form>
  );
}
