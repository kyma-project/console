import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import './ApplicationDetailsEventApis.scss';

import { ApplicationQueryContext } from '../ApplicationDetails.component';

import CreateEventApiForm from '../../../Api/CreateEventApiForm/CreateEventApiForm.container';

import { GenericList, handleDelete } from 'react-shared';
import ModalWithForm from '../../../../shared/components/ModalWithForm/ModalWithForm.container';

ApplicationDetailsEventApis.propTypes = {
  applicationId: PropTypes.string.isRequired,
  eventDefinitions: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteEventDefinition: PropTypes.func.isRequired,
};

export default function ApplicationDetailsEventApis({
  applicationId,
  eventDefinitions,
  sendNotification,
  deleteEventDefinition,
}) {
  const applicationQuery = React.useContext(ApplicationQueryContext);

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
        handleDelete('API', entry.id, entry.name, deleteEventDefinition, () => {
          showDeleteSuccessNotification(entry.name);
        }),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add Event Definition"
      button={{ glyph: 'add', text: '' }}
      confirmText="Create"
      performRefetch={applicationQuery.refetch}
      modalClassName="create-event-api-modal"
    >
      <CreateEventApiForm applicationId={applicationId} />
    </ModalWithForm>
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Event Definitions"
      notFoundMessage="There are no Event Definition available for this Application"
      actions={actions}
      entries={eventDefinitions.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
