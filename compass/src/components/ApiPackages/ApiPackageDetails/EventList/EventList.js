import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import './EventList.scss';

import CreateEventApiForm from 'components/Api/CreateEventApiForm/CreateEventApiForm';
import { GenericList, handleDelete, ModalWithForm } from 'react-shared';
import { Link } from 'fundamental-react';

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
    <Link
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`eventApi/${api.id}`)}
    >
      {api.name}
    </Link>,

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
      button={{ glyph: 'add', label: 'Add Event Definition' }}
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
      notFoundMessage="There are no Event Definition available for this Package"
      actions={actions}
      entries={eventDefinitions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
