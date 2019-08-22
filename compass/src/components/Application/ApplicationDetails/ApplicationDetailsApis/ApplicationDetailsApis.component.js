import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';

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

  function handleDelete(entry) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove API',
        body: `Are you sure you want to delete ${entry.name}?`,
        buttonConfirm: 'Confirm',
        buttonDismiss: 'Cancel',
      })
      .then(async () => {
        try {
          await deleteAPI(entry.id);
          showDeleteSuccessNotification(entry.name);
        } catch (error) {
          console.warn(error);
          LuigiClient.uxManager().showAlert({
            text: error.message,
            type: 'error',
            closeAfter: 10000,
          });
        }
      })
      .catch(() => {});
  }

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <span 
      className="link"
      onClick={() =>
        LuigiClient.linkManager().navigate(`api/${api.id}`)
      }
    >{api.name}</span>,
    api.description,
    api.targetURL,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: handleDelete,
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
