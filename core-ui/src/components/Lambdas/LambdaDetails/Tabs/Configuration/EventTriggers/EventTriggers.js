import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList } from 'react-shared';

import { SchemaComponent } from './Schema/Schema';

import { useDeleteEventTrigger } from '../../../../gql/hooks/mutations';
import { EVENT_TRIGGERS_PANEL, ERRORS } from '../../../../constants';

import CreateEventTriggerModal from './CreateEventTriggerModal';

export default function EventTriggers({
  lambda,
  eventTriggers = [],
  availableEvents = [],
  serverDataError,
  serverDataLoading,
}) {
  const deleteEventTrigger = useDeleteEventTrigger({ lambda });

  function showCollapseControl(schema) {
    return !!(schema && schema.properties && !schema.anyOf);
  }

  const actions = [
    {
      name: 'Delete',
      handler: eventTrigger => {
        deleteEventTrigger(eventTrigger);
      },
    },
  ];
  const headerRenderer = () => [
    '',
    'Event',
    'Version',
    'Application',
    'Description',
  ];
  const rowRenderer = eventTrigger => ({
    cells: [
      <span data-testid="event-trigger-type">{eventTrigger.eventType}</span>,
      <span data-testid="event-trigger-version">{eventTrigger.version}</span>,
      <span
        className="link"
        data-testid="event-trigger-source"
        onClick={() =>
          LuigiClient.linkManager().navigate(
            `/home/cmf-apps/details/${eventTrigger.source}`,
          )
        }
      >
        {eventTrigger.source}
      </span>,
      <span data-testid="event-trigger-description">
        {eventTrigger.description}
      </span>,
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
  });
  const textSearchProperties = [
    'eventType',
    'version',
    'source',
    'description',
  ];

  const createEventTrigger = (
    <CreateEventTriggerModal
      lambda={lambda}
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
        notFoundMessage={ERRORS.RESOURCES_NOT_FOUND}
        anySearchResultMessage={ERRORS.NOT_MATCHING_SEARCH_QUERY}
        serverErrorMessage={ERRORS.SERVER}
      />
    </div>
  );
}

EventTriggers.propTypes = {
  lambda: PropTypes.object.isRequired,
  eventTriggers: PropTypes.array.isRequired,
  availableEvents: PropTypes.array.isRequired,
  serverDataError: PropTypes.any,
  serverDataLoading: PropTypes.bool,
};
