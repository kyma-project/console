import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { Button } from 'fundamental-react';
import { handleDelete, PageHeader } from 'react-shared';
import { getApiDisplayName } from './../ApiHelpers';

EditApiHeader.propTypes = {
  api: PropTypes.object.isRequired,
  applicationName: PropTypes.string.isRequired,
  apiPackageName: PropTypes.string.isRequired,
  saveChanges: PropTypes.func.isRequired,
  canSaveChanges: PropTypes.bool.isRequired,
  deleteApi: PropTypes.func.isRequired,
  deleteEventApi: PropTypes.func.isRequired,
};

function navigateToApplication() {
  LuigiClient.linkManager()
    .fromContext('application')
    .navigate('');
}

export default function EditApiHeader({
  api,
  applicationName,
  apiPackageName,
  saveChanges,
  canSaveChanges,
  deleteApi,
  deleteEventApi,
}) {
  const performDelete = () => {
    const isApi = 'targetURL' in api;
    const mutation = isApi ? deleteApi : deleteEventApi;
    handleDelete('Api', api.id, api.name, mutation, navigateToApplication);
  };

  const breadcrumbItems = [
    { name: 'Applications', path: '/applications', fromContext: 'tenant' },
    { name: applicationName, path: '/', fromContext: 'application' },
    {
      name: apiPackageName,
      path: '/',
      fromContext: 'api-package',
    },
    { name: api.name, path: '/' },
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
      title={api.name}
      breadcrumbItems={breadcrumbItems}
      actions={actions}
    >
      <PageHeader.Column title="Type">
        {getApiDisplayName(api) || <em>Not provided</em>}
      </PageHeader.Column>
    </PageHeader>
  );
}
