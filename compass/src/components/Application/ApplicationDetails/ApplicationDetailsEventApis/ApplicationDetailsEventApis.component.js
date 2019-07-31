import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';

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

  function handleDelete(entry) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove Event API',
        body: `Are you sure you want to delete ${entry.name}?`,
        buttonConfirm: 'Confirm',
        buttonDismiss: 'Cancel',
      })
      .then(async () => {
        try {
          await deleteEventAPI(entry.id);
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

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <span className="link">{api.name}</span>,
    api.description,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: handleDelete,
    },
  ];

  return (
    <Panel className="fd-has-margin-top-medium">
      <GenericList
        extraHeaderContent={<CreateAPIModal applicationId={applicationId} />}
        title="Event APIs"
        notFoundMessage="There are no Event APIs available for this Application"
        actions={actions}
        entries={eventApis.data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
