import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import './EventList.scss';

import CreateEventApiForm from 'components/Api/CreateEventApiForm/CreateEventApiForm';
import { GenericList, handleDelete } from 'react-shared';
import ModalWithForm from 'shared/components/ModalWithForm/ModalWithForm.container';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_EVENT_DEFINITION } from 'components/Api/gql';
import { GET_API_PACKAGE } from 'components/ApiPackages/gql';
import { SEND_NOTIFICATION } from 'gql';

EventList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
  eventDefinitions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function EventList({
  applicationId,
  apiPackageId,
  eventDefinitions,
}) {
  const [sendNotification] = useMutation(SEND_NOTIFICATION);
  const [deleteEventDefinition] = useMutation(DELETE_EVENT_DEFINITION, {
    refetchQueries: () => [
      { query: GET_API_PACKAGE, variables: { applicationId, apiPackageId } },
    ],
  });

  function showDeleteSuccessNotification(apiName) {
    sendNotification({
      variables: {
        content: `Deleted API "${apiName}".`,
        title: `${apiName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: apiName,
      },
    });
  }

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
      handler: entry =>
        handleDelete(
          'API',
          entry.id,
          entry.name,
          () => deleteEventDefinition({ variables: { id: entry.id } }),
          () => showDeleteSuccessNotification(entry.name),
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add Event Definition"
      button={{ glyph: 'add', text: '' }}
      confirmText="Create"
      modalClassName="create-event-api-modal"
      renderForm={props => (
        <CreateEventApiForm
          applicationId={applicationId}
          apiPackageId={apiPackageId}
          {...props}
        />
      )}
    />
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Event Definitions"
      notFoundMessage="There are no Event Definition available for this API Package"
      actions={actions}
      entries={eventDefinitions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
