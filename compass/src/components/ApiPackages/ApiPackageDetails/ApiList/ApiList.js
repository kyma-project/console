import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import './ApiList.scss';

import CreateApiForm from 'components/Api/CreateApiForm/CreateApiForm';
import { GenericList, handleDelete } from 'react-shared';
import ModalWithForm from 'shared/components/ModalWithForm/ModalWithForm.component';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_API_DEFINITION } from 'components/Api/gql';
import { GET_API_PACKAGE } from '../../gql';
import { SEND_NOTIFICATION } from 'gql';

ApiList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
  apiDefinitions: PropTypes.object.isRequired,
};

export default function ApiList({
  applicationId,
  apiPackageId,
  apiDefinitions,
}) {
  const [sendNotification] = useMutation(SEND_NOTIFICATION);
  const [deleteApiDefinition] = useMutation(DELETE_API_DEFINITION, {
    refetchQueries: () => [
      { query: GET_API_PACKAGE, variables: { applicationId, apiPackageId } },
    ],
  });

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
        handleDelete(
          'API',
          entry.id,
          entry.name,
          () => deleteApiDefinition({ variables: { id: entry.id } }),
          () => {
            showDeleteSuccessNotification(entry.name);
          },
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add API Definition"
      button={{ glyph: 'add', text: '' }}
      confirmText="Create"
      modalClassName="create-api-modal"
      renderForm={props => (
        <CreateApiForm
          applicationId={applicationId}
          apiPackageId={apiPackageId}
          {...props}
        />
      )}
    />
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="API Definitions"
      notFoundMessage="There are no API Definitions available for this API Package"
      actions={actions}
      entries={apiDefinitions.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description', 'targetURL']}
    />
  );
}
