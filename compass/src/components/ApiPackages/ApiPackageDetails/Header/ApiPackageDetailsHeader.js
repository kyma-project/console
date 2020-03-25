import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { PageHeader, handleDelete } from 'react-shared';
import { Button } from 'fundamental-react';
import RequestInputSchemaModal from '../RequestInputSchemaModal/RequestInputSchemaModal';
import ModalWithForm from 'shared/components/ModalWithForm/ModalWithForm';
import EditApiPackageForm from './../EditApiPackageForm/EditApiPackageForm';
import './ApiPackageDetailsHeader.scss';

import { useMutation } from '@apollo/react-hooks';
import {
  GET_API_PACKAGE,
  DELETE_API_PACKAGE,
} from 'components/ApiPackages/gql';
import { SEND_NOTIFICATION } from 'gql';

ApiPackageDetailsHeader.propTypes = {
  apiPackage: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

function navigateToApplication() {
  LuigiClient.linkManager()
    .fromContext('application')
    .navigate('');
}

export default function ApiPackageDetailsHeader({ apiPackage, application }) {
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

  const [deleteApiPackageMutation] = useMutation(DELETE_API_PACKAGE, {
    refetchQueries: () => [
      {
        query: GET_API_PACKAGE,
        variables: {
          applicationId: application.id,
          apiPackageId: apiPackage.id,
        },
      },
    ],
  });

  function showDeleteSuccessNotification() {
    sendNotification({
      variables: {
        content: `Deleted Package "${apiPackage.name}".`,
        title: apiPackage.name,
        color: '#359c46',
        icon: 'accept',
        instanceName: apiPackage.name,
      },
    });
  }

  const breadcrumbItems = [
    { name: 'Applications', path: '/applications', fromContext: 'tenant' },
    { name: application.name, path: '/', fromContext: 'application' },
    { name: '' },
  ];

  const deleteApiPackage = () => {
    handleDelete(
      'Package',
      apiPackage.id,
      apiPackage.name,
      id => deleteApiPackageMutation({ variables: { id } }),
      () => {
        navigateToApplication();
        showDeleteSuccessNotification();
      },
    );
  };

  const actions = (
    <div className="api-package-header__actions">
      <ModalWithForm
        title="Edit Package"
        button={{ text: 'Edit', option: 'light' }}
        confirmText="Edit"
        renderForm={props => (
          <EditApiPackageForm
            applicationId={application.id}
            apiPackage={apiPackage}
            {...props}
          />
        )}
      />
      <Button onClick={deleteApiPackage} type="negative" option="light">
        Delete
      </Button>
    </div>
  );

  return (
    <PageHeader
      title={apiPackage.name}
      breadcrumbItems={breadcrumbItems}
      actions={actions}
    >
      <PageHeader.Column title="Name">{apiPackage.name}</PageHeader.Column>
      <PageHeader.Column title="Description" columnSpan={2}>
        {apiPackage.description}
      </PageHeader.Column>
      <PageHeader.Column title="Auth Request Input Schema" columnSpan={3}>
        <RequestInputSchemaModal
          schema={apiPackage.instanceAuthRequestInputSchema}
        />
      </PageHeader.Column>
    </PageHeader>
  );
}
