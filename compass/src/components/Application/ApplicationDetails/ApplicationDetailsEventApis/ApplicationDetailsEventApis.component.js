import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { showErrorPrompt } from './../../../../shared/utility';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import CreateAPIModal from '../CreateAPIModal/CreateAPIModal.container';

ApplicationDetailsEventApis.propTypes = {
  applicationId: PropTypes.string.isRequired,
  eventApis: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteEventAPI: PropTypes.func.isRequired,
};

export default function ApplicationDetailsEventApis(props) {
  function showSuccessNotification(apiName) {
    props.sendNotification({
      variables: {
        content: `Deleted Event API "${apiName}".`,
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
        header: 'Remove Event API',
        body: `Are you sure you want to delete ${entry.name}?`,
        buttonConfirm: 'Yes',
        buttonDismiss: 'No',
      })
      .then(async () => {
        try {
          await props.deleteEventAPI(entry.id, props.applicationId);
          showSuccessNotification(entry.name);
        } catch (error) {
          console.warn(error);
          showErrorPrompt(error);
        }
      })
      .catch(() => {});
  }

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <span className="link">
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: deleteHandler,
    },
  ];

  const { applicationId, eventApis } = props;

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
