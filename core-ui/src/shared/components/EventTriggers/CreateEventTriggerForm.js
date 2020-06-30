import React, { useState, useEffect } from 'react';
import { GenericList } from 'react-shared';

import Checkbox from 'components/Lambdas/Checkbox/Checkbox';

import { SchemaComponent } from './Schema/Schema';

import './CreateEventTriggerForm.scss';

const headerRenderer = () => [
  '',
  '',
  'Event',
  'Version',
  'Source / Application',
  'Description',
];
const textSearchProperties = ['eventType', 'version', 'source', 'description'];

export default function CreateEventTriggerForm({
  availableEvents = [],
  formElementRef,
  setValidity = () => void 0,
  onSubmit,
}) {
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

  const rowRenderer = event => ({
    cells: [
      <Checkbox
        initialChecked={isChecked(event)}
        name={event.uniqueID}
        onChange={_ => onSetCheckedEvents(event)}
      />,
      <span>{event.eventType || '*'}</span>,
      <span>{event.version || '*'}</span>,
      <span>{event.source || '*'}</span>,
      <span>{event.description || '-'}</span>,
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

  async function handleSubmit() {
    await onSubmit(checkedEvents);
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
