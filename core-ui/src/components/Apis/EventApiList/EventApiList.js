import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import CreateEventApiForm from '../CreateEventForm/CreateEventForm';

import { GenericList, easyHandleDelete, useNotification } from 'react-shared';
import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import { CompassGqlContext } from 'index';
import { DELETE_EVENT_DEFINITION } from 'gql/mutations';
import { useMutation } from '@apollo/react-hooks';

EventApiList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  eventApis: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function EventApiList({ applicationId, eventApis }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const notificationManager = useNotification();

  const [deleteEventDefinition] = useMutation(DELETE_EVENT_DEFINITION, {
    client: compassGqlClient,
  });

  function navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`eventApi/${entry.id}/edit`);
  }

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <span
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`eventApi/${api.id}`)}
    >
      {api.name}
    </span>,
    api.description,
  ];

  const actions = [
    {
      name: 'Edit',
      handler: navigateToDetails,
    },
    {
      name: 'Delete',
      handler: eventApi =>
        easyHandleDelete(
          'Event API',
          eventApi.name,
          deleteEventDefinition,
          {
            variables: { id: eventApi.id },
          },
          'deleteEventDefinition',
          notificationManager,
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add Event Definition"
      button={{ glyph: 'add', text: '' }}
      renderForm={props => (
        <CreateEventApiForm applicationId={applicationId} {...props} />
      )}
    />
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Event Definitions"
      notFoundMessage="There are no Event Definition available for this Application"
      actions={actions}
      entries={eventApis}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
