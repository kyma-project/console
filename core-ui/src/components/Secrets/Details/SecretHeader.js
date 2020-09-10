import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import {
  PageHeader,
  useNotification,
  easyHandleDelete,
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
      {Object.keys(secret.annotations).length !== 0 && (
        <PageHeader.Column title="Annotations">
          {Object.keys(secret.annotations).map(key => (
            <Modal
              key={key}
              modalOpeningComponent={<Link>{key}</Link>}
              title={key}
              confirmText="Close"
            >
              {secret.annotations[key]}
            </Modal>
          ))}
        </PageHeader.Column>
      )}
    </PageHeader>
  );
}
