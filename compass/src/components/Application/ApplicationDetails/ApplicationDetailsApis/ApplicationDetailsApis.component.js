import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList } from 'react-shared';

import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';
import { handleDelete } from 'react-shared';

ApplicationDetailsApis.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiDefinitions: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteAPIDefinition: PropTypes.func.isRequired,
};

export default function ApplicationDetailsApis({
  applicationId,
  apiDefinitions,
  sendNotification,
  deleteAPIDefinition,
}) {
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
    LuigiClient.linkManager().navigate(`api/${entry.id}/edit`);
  }

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <span
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`api/${api.id}`)}
    >
      {api.name}
    </span>,
    api.description,
    api.targetURL,
  ];

  const actions = [
    {
      name: 'Edit',
      handler: navigateToDetails,
    },
    {
      name: 'Delete',
      handler: entry =>
        handleDelete('API', entry.id, entry.name, deleteAPIDefinition, () => {
          showDeleteSuccessNotification(entry.name);
        }),
    },
  ];

  return (
    <GenericList
      extraHeaderContent={<CreateAPIModal applicationId={applicationId} />}
      title="API Definitions"
      notFoundMessage="There are no API Definitions available for this Application"
      actions={actions}
      entries={apiDefinitions.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description', 'targetURL']}
    />
  );
}
