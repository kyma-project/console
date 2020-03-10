import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList, handleDelete } from 'react-shared';

import { SEND_NOTIFICATION } from 'gql';
import { DELETE_API_PACKAGE } from './../../../ApiPackages/gql';
import { useMutation } from '@apollo/react-hooks';
import { GET_APPLICATION } from 'components/Application/gql';

import ModalWithForm from 'shared/components/ModalWithForm/ModalWithForm.container';
import CreateApiPackageForm from 'components/ApiPackages/CreateApiPackageForm/CreateApiPackageForm';
import { Counter } from 'fundamental-react';

ApplicationApiPackages.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackages: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function ApplicationApiPackages({ applicationId, apiPackages }) {
  const [deleteApiPackage] = useMutation(DELETE_API_PACKAGE, {
    refetchQueries: () => [
      { query: GET_APPLICATION, variables: { id: applicationId } },
    ],
  });
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

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
    LuigiClient.linkManager().navigate(`apiPackage/${entry.id}`);
  }

  const headerRenderer = () => [
    'Name',
    'Description',
    'API Definitions',
    'Event Definitions',
  ];

  const rowRenderer = apiPackage => [
    <span className="link" onClick={() => navigateToDetails(apiPackage)}>
      {apiPackage.name}
    </span>,
    apiPackage.description,
    <Counter>{apiPackage.apiDefinitions.totalCount}</Counter>,
    <Counter>{apiPackage.eventDefinitions.totalCount}</Counter>,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry =>
        handleDelete(
          'Package',
          entry.id,
          entry.name,
          id => deleteApiPackage({ variables: { id } }),
          () => showDeleteSuccessNotification(entry.name),
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Create Package"
      button={{ glyph: 'add', text: '' }}
      confirmText="Create"
      renderForm={props => (
        <CreateApiPackageForm applicationId={applicationId} {...props} />
      )}
    />
  );

  return (
    <GenericList
      title="Packages"
      extraHeaderContent={extraHeaderContent}
      notFoundMessage="There are no Packages defined for this Application"
      actions={actions}
      entries={apiPackages}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description']}
    />
  );
}
