import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { Button } from 'fundamental-react';
import { easyHandleDelete, useNotification, PageHeader } from 'react-shared';
import { getApiDisplayName } from '../ApiHelpers';

import { DELETE_API_DEFINITION, DELETE_EVENT_DEFINITION } from 'gql/mutations';
import { useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';

EditApiHeader.propTypes = {
  api: PropTypes.object.isRequired,
  apiPackage: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
  saveChanges: PropTypes.func.isRequired,
  canSaveChanges: PropTypes.bool.isRequired,
};

function navigateToApplication(application) {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`/details/${application.id}`);
}

export default function EditApiHeader({
  api,
  apiPackage,
  application,
  saveChanges,
  canSaveChanges,
}) {
  const notificationManager = useNotification();
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [deleteApi] = useMutation(DELETE_API_DEFINITION, {
    client: compassGqlClient,
  });
  const [deleteEventApi] = useMutation(DELETE_EVENT_DEFINITION, {
    client: compassGqlClient,
  });

  const performDelete = () => {
    const isApi = 'targetURL' in api;
    const mutation = isApi ? deleteApi : deleteEventApi;
    const operationName = isApi
      ? 'deleteAPIDefinition'
      : 'deleteEventDefinition';

    easyHandleDelete(
      'API',
      api.name,
      mutation,
      {
        variables: { id: api.id },
      },
      operationName,
      notificationManager,
      () => navigateToApplication(application),
    );
  };

  const getApiPath = () => {
    const isApi = 'targetURL' in api;
    return `/details/${application.id}/apiPackage/${apiPackage.id}/${
      isApi ? 'api' : 'eventApi'
    }/${api.id}`;
  };

  const breadcrumbItems = [
    { name: 'Applications', path: '/' },
    { name: application.name, path: `/details/${application.id}` },
    {
      name: apiPackage.name,
      path: `/details/${application.id}/apiPackage/${apiPackage.id}`,
    },
    { name: api.name, path: getApiPath() },
    { name: '' },
  ];

  const actions = (
    <>
      <Button
        onClick={saveChanges}
        disabled={!canSaveChanges}
        option="emphasized"
      >
        Save
      </Button>
      <Button onClick={performDelete} option="light" type="negative">
        Delete
      </Button>
    </>
  );

  return (
    <PageHeader
      breadcrumbItems={breadcrumbItems}
      title={api.name}
      actions={actions}
    >
      <PageHeader.Column title="Type">
        {getApiDisplayName(api) || <em>Not provided</em>}
      </PageHeader.Column>
    </PageHeader>
  );
}
