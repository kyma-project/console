import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { PageHeader, useNotification, easyHandleDelete } from 'react-shared';
import { Button } from 'fundamental-react';
import ClientStatus from '../Status/OAuthClientStatus';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_OAUTH_CLIENT, UPDATE_OAUTH_CLIENT } from 'gql/mutations';
import { GET_OAUTH_CLIENT } from 'gql/queries';

OAuthClientHeader.propTypes = {
  client: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  updatedSpec: PropTypes.object.isRequired,
};

export default function OAuthClientHeader({
  client,
  isEditMode,
  canSave,
  setEditMode,
  updatedSpec,
}) {
  const { name, namespace, generation, error } = client;
  const notificationManager = useNotification();

  const [deleteClientMutation] = useMutation(DELETE_OAUTH_CLIENT);
  const [updateClient] = useMutation(UPDATE_OAUTH_CLIENT, {
    refetchQueries: () => [
      { query: GET_OAUTH_CLIENT, variables: { namespace, name } },
    ],
  });

  const breadcrumbs = [{ name: 'OAuth Clients', path: '/' }, { name: '' }];

  const deleteClient = () => {
    easyHandleDelete(
      'OAuth Client',
      name,
      deleteClientMutation,
      { variables: { name, namespace } },
      'deleteOAuth2Client',
      notificationManager,
      () =>
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate('/'),
    );
  };

  const saveClient = async () => {
    delete updatedSpec.__typename;
    try {
      await updateClient({
        variables: {
          name,
          namespace,
          generation,
          params: updatedSpec,
        },
      });
      notificationManager.notifySuccess({
        content: `OAuth Client ${name} updated`,
      });
      setEditMode(false);
    } catch (e) {
      console.log(e);
      notificationManager.notifyError({
        content: `An error occurred while updating OAuth Client: ${e.message}`,
      });
    }
  };

  const actions = isEditMode ? (
    <>
      <Button onClick={saveClient} option="emphasized" disabled={!canSave}>
        Save
      </Button>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
    </>
  ) : (
    <>
      <Button onClick={() => setEditMode(true)} option="emphasized">
        Edit
      </Button>
      <Button onClick={() => deleteClient()} option="light" type="negative">
        Delete
      </Button>
    </>
  );

  return (
    <PageHeader title={name} breadcrumbItems={breadcrumbs} actions={actions}>
      <PageHeader.Column title="Status">
        <ClientStatus error={error} />
      </PageHeader.Column>
    </PageHeader>
  );
}
