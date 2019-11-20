import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { GenericList } from 'react-shared';
import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';
import { handleDelete } from 'react-shared';

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

  return (
    <GenericList
      extraHeaderContent={<CreateAPIModal applicationId={applicationId} />}
      title="Event APIs"
      notFoundMessage="There are no Event APIs available for this Application"
      actions={actions}
      entries={eventApis.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
