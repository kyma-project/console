import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import {
  PageHeader,
  useNotification,
  easyHandleDelete,
  Labels,
  Modal,
} from 'react-shared';
import { Button, Link } from 'fundamental-react';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_SECRET } from 'gql/mutations';

SecretHeader.propTypes = {
  secret: PropTypes.object.isRequired,
};

export default function SecretHeader({ secret }) {
  const { name, namespace } = secret;
  const notificationManager = useNotification();

  const [deleteSecretMutation] = useMutation(DELETE_SECRET);

  const breadcrumbs = [{ name: 'Secrets', path: '/' }, { name: '' }];

  const deleteSecret = () => {
    easyHandleDelete(
      'Secret',
      name,
      deleteSecretMutation,
      { variables: { name, namespace } },
      'deleteSecret',
      notificationManager,
      () =>
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate('/'),
    );
  };

  const actions = (
    <Button onClick={() => deleteSecret()} option="light" type="negative">
      Delete
    </Button>
  );

  return (
    <PageHeader title={name} breadcrumbItems={breadcrumbs} actions={actions}>
      <PageHeader.Column title="Annotations" columnSpan="1 / 2">
        <Labels labels={secret.annotations} />
      </PageHeader.Column>
      <PageHeader.Column title="Labels" columnSpan="2 / 4">
        <Labels labels={secret.labels} />
      </PageHeader.Column>
    </PageHeader>
  );
}
