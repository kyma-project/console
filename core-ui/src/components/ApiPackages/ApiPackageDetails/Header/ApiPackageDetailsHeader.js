import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { PageHeader, handleDelete, useNotification } from 'react-shared';
import { Button } from 'fundamental-react';
import RequestInputSchemaModal from '../RequestInputSchemaModal/RequestInputSchemaModal';
import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import EditApiPackageForm from './../EditApiPackageForm/EditApiPackageForm';
import './ApiPackageDetailsHeader.scss';
import { CompassGqlContext } from 'index';

import { useMutation } from '@apollo/react-hooks';
import {
  GET_API_PACKAGE,
  DELETE_API_PACKAGE,
} from 'components/ApiPackages/gql';

ApiPackageDetailsHeader.propTypes = {
  apiPackage: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

function navigateToApplication(applicationId) {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`/details/${applicationId}`);
}

export default function ApiPackageDetailsHeader({ apiPackage, application }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const notificationManager = useNotification();

  const [deleteApiPackageMutation] = useMutation(DELETE_API_PACKAGE, {
    client: compassGqlClient,
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

  const breadcrumbItems = [
    { name: 'Applications', path: '/applications', fromContext: 'tenant' },
    { name: application.name, path: '/', fromContext: 'application' },
    { name: apiPackage.name, path: '/' },
    { name: '' },
  ];

  const deleteApiPackage = () => {
    handleDelete(
      'Package',
      apiPackage.id,
      apiPackage.name,
      id => deleteApiPackageMutation({ variables: { id } }),
      () => {
        navigateToApplication(application.id);
        notificationManager.notifySuccess({
          content: `${apiPackage.name} deleted`,
        });
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
