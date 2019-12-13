import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import './ApplicationDetailsApis.scss';

import { ApplicationQueryContext } from './../ApplicationDetails.component';

import CreateApiForm from '../../../Api/CreateApiForm/CreateApiForm.container';

import { GenericList, handleDelete } from 'react-shared';
import ModalWithForm from './../../../../shared/components/ModalWithForm/ModalWithForm.container';

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
        handleDelete('API', entry.id, entry.name, deleteAPI, () => {
          showDeleteSuccessNotification(entry.name);
        }),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add Rest API"
      button={{ text: 'Add Rest API', option: 'light' }}
      confirmText="Create"
      performRefetch={applicationQuery.refetch}
      className="create-api-modal"
    >
      <CreateApiForm applicationId={applicationId} />
    </ModalWithForm>
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Rest APIs"
      notFoundMessage="There are no APIs available for this Application"
      actions={actions}
      entries={apis.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description', 'targetURL']}
    />
  );
}
