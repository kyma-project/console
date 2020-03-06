import React from 'react';
import PropTypes from 'prop-types';

import { PageHeader, handleDelete } from 'react-shared';
import { Button } from 'fundamental-react';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_API_PACKAGE } from 'components/ApiPackages/gql';
import RequestInputSchemaModal from '../RequestInputSchemaModal/RequestInputSchemaModal';

ApiPackageDetailsHeader.propTypes = {
  apiPackage: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

export default function ApiPackageDetailsHeader({ apiPackage, application }) {
  const [deleteApiPackageMutation] = useMutation(DELETE_API_PACKAGE);

  const breadcrumbItems = [
    { name: 'Applications', path: '/applications', fromContext: 'tenant' },
    { name: application.name, path: '/', fromContext: 'application' },
    {
      name: apiPackage.name,
      path: '/',
    },
    { name: '' },
  ];

  const deleteApiPackage = () => {
    handleDelete(
      'API Package',
      apiPackage.id,
      apiPackage.name,
      id => deleteApiPackageMutation({ variables: { id } }),
      () => {
        // showDeleteSuccessNotification(entry.name);
        console.log('navigate eh');
      },
    );
  };

  const deleteButton = (
    <Button onClick={deleteApiPackage} type="negative" option="light">
      Delete
    </Button>
  );

  return (
    <PageHeader
      title={apiPackage.name}
      breadcrumbItems={breadcrumbItems}
      actions={deleteButton}
    >
      <PageHeader.Column title="Name">{apiPackage.name}</PageHeader.Column>
      <PageHeader.Column title="Description" columnSpan={2}>
        {apiPackage.description}
      </PageHeader.Column>
      <PageHeader.Column title="Request Input Schema" columnSpan={3}>
        <RequestInputSchemaModal
          schema={apiPackage.instanceAuthRequestInputSchema}
        />
      </PageHeader.Column>
    </PageHeader>
  );
}
