import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';
import handleDelete from '../../../../shared/components/GenericList/actionHandlers/simpleDelete';

ApplicationDetailsApis.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apis: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteAPI: PropTypes.func.isRequired,
};

export default function ApplicationDetailsApis({
  applicationId,
  apis,
  sendNotification,
  deleteAPI,
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
      name: 'Delete',
      handler: entry =>
        handleDelete('API', entry.id, entry.name, deleteAPI, () => {
          showDeleteSuccessNotification(entry.name);
        }),
    },
  ];

  return (
    <Panel className="fd-has-margin-top-small">
      <GenericList
        extraHeaderContent={<CreateAPIModal applicationId={applicationId} />}
        title="APIs"
        notFoundMessage="There are no APIs available for this Application"
        actions={actions}
        entries={apis.data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
