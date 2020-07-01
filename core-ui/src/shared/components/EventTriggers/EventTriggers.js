import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { GenericList } from 'react-shared';

import { SchemaComponent } from './Schema/Schema';

import { EVENT_TRIGGERS_PANEL, ERRORS } from '../../constants';

import CreateEventTriggerModal from './CreateEventTriggerModal';

const headerRenderer = () => [
  '',
  'Event',
  'Version',
  'Application',
  'Description',
];
const textSearchProperties = ['eventType', 'version', 'source', 'description'];

function EventTriggerSource({ source }) {
  if (!source) {
    return <span>*</span>;
  }

  return (
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager().navigate(`/home/cmf-apps/details/${source}`)
      }
    >
      {source}
    </span>
  );
}

export default function EventTriggers({
  eventTriggers = [],
  availableEvents = [],
  serverDataError,
  serverDataLoading,
  onTriggersAdd,
  onTriggerDelete,
  notFoundMessage = EVENT_TRIGGERS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND,
}) {
  function showCollapseControl(schema) {
    return !!(schema && schema.properties && !schema.anyOf);
  }

  const actions = [
    {
      name: 'Delete',
      handler: onTriggerDelete,
    },
  ];
  const rowRenderer = eventTrigger => ({
    cells: [
      <span>{eventTrigger.eventType || '*'}</span>,
      <span>{eventTrigger.version || '*'}</span>,
      <EventTriggerSource source={eventTrigger.source} />,
      <span>{eventTrigger.description || '-'}</span>,
    ],
    collapseContent: (
      <>
        <td></td>
        <td colSpan="4">
          <SchemaComponent schema={eventTrigger.schema} />
        </td>
        <td></td>
      </>
    ),
    showCollapseControl: showCollapseControl(eventTrigger.schema),
    withCollapseControl: true,
  });

  const createEventTrigger = (
    <CreateEventTriggerModal
      onSubmit={onTriggersAdd}
      queryError={serverDataError}
      availableEvents={availableEvents}
    />
  );

  return (
    <div>
      <GenericList
        title={EVENT_TRIGGERS_PANEL.LIST.TITLE}
        showSearchField={true}
        textSearchProperties={textSearchProperties}
        showSearchSuggestion={false}
        extraHeaderContent={createEventTrigger}
        actions={actions}
        entries={eventTriggers}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        serverDataError={serverDataError}
        serverDataLoading={serverDataLoading}
        notFoundMessage={notFoundMessage}
        noSearchResultMessage={
          EVENT_TRIGGERS_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
        }
        serverErrorMessage={ERRORS.SERVER}
      />
    </div>
  );
}

EventTriggers.propTypes = {
  eventTriggers: PropTypes.array.isRequired,
  availableEvents: PropTypes.array.isRequired,
  serverDataError: PropTypes.any,
  serverDataLoading: PropTypes.bool,
  onTriggerDelete: PropTypes.func.isRequired,
  onTriggersAdd: PropTypes.func.isRequired,
};
