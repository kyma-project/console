import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import jsyaml from 'js-yaml';

import {
  PageHeader,
  useNotification,
  easyHandleDelete,
  Labels,
  useYamlEditor,
} from 'react-shared';
import { Button } from 'fundamental-react';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_SECRET, UPDATE_SECRET } from 'gql/mutations';

import { GET_SECRET_DETAILS } from 'gql/queries';

SecretHeader.propTypes = {
  secret: PropTypes.object.isRequired,
};

export default function SecretHeader({ secret }) {
  const { name, namespace } = secret;
  const notificationManager = useNotification();

  const setEditedSpec = useYamlEditor();

  const [updateSecretMutation] = useMutation(UPDATE_SECRET);
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

  const updateSecret = async updatedSpec => {
    try {
      await updateSecretMutation({
        variables: {
          namespace: namespace,
          name: secret.name,
          secret: updatedSpec,
        },
        refetchQueries: () => [
          {
            query: GET_SECRET_DETAILS,
            variables: {
              namespace: namespace,
              name: secret.name,
            },
          },
        ],
      });
      notificationManager.notifySuccess({
        content: 'Secret updated successfully',
      });
    } catch (e) {
      console.warn(e);
      notificationManager.notifyError({
        content: `Cannot update secret: ${e.message}.`,
      });
      throw e;
    }
  };

  const actions = (
    <>
      <Button
        option="emphasized"
        onClick={() =>
          setEditedSpec(
            secret.json,
            async spec => await updateSecret(jsyaml.safeLoad(spec)),
          )
        }
      >
        Edit
      </Button>
      <Button onClick={() => deleteSecret()} option="light" type="negative">
        Delete
      </Button>
    </>
  );

  return (
    <PageHeader
      title={name}
      breadcrumbItems={breadcrumbs}
      actions={actions}
      columnWrapperClassName="column-wrapper-even-split"
    >
      <PageHeader.Column title="Annotations" columnSpan="1">
        <Labels labels={secret.annotations} />
      </PageHeader.Column>
      <PageHeader.Column title="Labels" columnSpan="2">
        <Labels labels={secret.labels} />
      </PageHeader.Column>
    </PageHeader>
  );
}
