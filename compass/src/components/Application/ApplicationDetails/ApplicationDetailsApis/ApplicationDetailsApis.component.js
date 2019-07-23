import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { showErrorPrompt } from './../../../../shared/utility';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';

ApplicationDetailsApis.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apis: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteAPI: PropTypes.func.isRequired,
};

export default function ApplicationDetailsApis(props) {
  function showDeleteSuccessNotification(apiName) {
    props.sendNotification({
      variables: {
        content: `Deleted API "${apiName}".`,
        title: `${apiName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: apiName,
      },
    });
  }

  function deleteHandler(entry) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove API',
        body: `Are you sure you want to delete ${entry.name}?`,
        buttonConfirm: 'Yes',
        buttonDismiss: 'No',
      })
      .then(async () => {
        try {
          await props.deleteAPI(entry.id, props.applicationId);
          showDeleteSuccessNotification(entry.name);
        } catch (error) {
          console.warn(error);
          showErrorPrompt(error);
        }
      })
      .catch(() => {});
  }

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <span className="link">
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
    api.targetURL,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: deleteHandler,
    },
  ];

  const { applicationId, apis } = props;

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
