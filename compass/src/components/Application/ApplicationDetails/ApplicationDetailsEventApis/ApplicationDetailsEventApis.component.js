import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import './ApplicationDetailsEventApis.scss';

import { ApplicationQueryContext } from '../ApplicationDetails.component';

import CreateEventApiForm from '../../../Apis/CreateEventApiForm/CreateEventApiForm.container';

import { GenericList, handleDelete } from 'react-shared';
import ModalWithForm from '../../../../shared/components/ModalWithForm/ModalWithForm.container';

ApplicationDetailsEventApis.propTypes = {
  applicationId: PropTypes.string.isRequired,
  eventApis: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteEventAPI: PropTypes.func.isRequired,
};

export default function ApplicationDetailsEventApis({
  applicationId,
  eventApis,
  sendNotification,
  deleteEventAPI,
}) {
  const applicationQuery = React.useContext(ApplicationQueryContext);

  function showDeleteSuccessNotification(apiName) {
    sendNotification({
      variables: {
        content: `Deleted Event API "${apiName}".`,
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
        handleDelete('Event API', entry.id, entry.name, deleteEventAPI, () => {
          showDeleteSuccessNotification(entry.name);
        }),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add Event API"
      button={{ text: 'Add Event API', option: 'light' }}
      confirmText="Create"
      performRefetch={applicationQuery.refetch}
      className="create-event-api-modal"
    >
      <CreateEventApiForm applicationId={applicationId} />
    </ModalWithForm>
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Event APIs"
      notFoundMessage="There are no Event APIs available for this Application"
      actions={actions}
      entries={eventApis.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
