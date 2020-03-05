import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { ApplicationQueryContext } from './../ApplicationDetails.component';

import { GenericList, handleDelete } from 'react-shared';

import { SEND_NOTIFICATION } from 'gql';
import { DELETE_API_PACKAGE } from './../../../ApiPackages/gql';
import { useMutation } from '@apollo/react-hooks';
import { GET_APPLICATION } from 'components/Application/gql';

ApplicationApiPackages.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackages: PropTypes.object.isRequired, //?
};

export default function ApplicationApiPackages({ applicationId, apiPackages }) {
  const applicationQuery = React.useContext(ApplicationQueryContext);

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

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = apiPackage => [
    <span className="link" onClick={() => navigateToDetails(apiPackage)}>
      {apiPackage.name}
    </span>,
    apiPackage.description,
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
          'API Package',
          entry.id,
          entry.name,
          id => deleteApiPackage({ variables: { id } }),
          () => showDeleteSuccessNotification(entry.name),
        ),
    },
  ];

  return (
    <GenericList
      title="API Packages"
      notFoundMessage="There are no API Packages defined for this Application"
      actions={actions}
      entries={apiPackages.data}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description']}
    />
  );
}
