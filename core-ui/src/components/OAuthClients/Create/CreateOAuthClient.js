import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { PageHeader, useNotification } from 'react-shared';
import { CREATE_OAUTH_CLIENT } from 'gql/mutations';
import OAuthClientForm from '../Form/OAuthClientForm';
import { Button } from 'fundamental-react';

CreateOAuthClient.propTypes = { namespace: PropTypes.string.isRequired };

const emptySpec = {
  grantTypes: [],
  responseTypes: [],
  scope: 'read',
  secretName: '',
};

export default function CreateOAuthClient({ namespace }) {
  const [spec, setSpec] = React.useState(emptySpec);
  const [name, setName] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [createOAuth2ClientMutation] = useMutation(CREATE_OAUTH_CLIENT, {
    onError: handleCreateError,
    onCompleted: handleCreateSuccess,
  });
  const notificationManager = useNotification();

  const { redirectPath, redirectCtx = 'namespaces' } =
    LuigiClient.getNodeParams() || {};

  function handleCreateError(error) {
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(decodeURIComponent(redirectPath));
      return;
    }

    notificationManager.notifyError({
      content: `Could not create OAuth Client: ${error.message}`,
    });
  }

  function handleCreateSuccess(data) {
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(decodeURIComponent(redirectPath));
      return;
    }

    const createdOAuthClientData = data.createOAuth2Client;
    if (createdOAuthClientData) {
      notificationManager.notifySuccess({
        content: `OAuth Client ${createdOAuthClientData.name} created successfully`,
      });

      LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`/details/${createdOAuthClientData.name}`);
    }
  }

  function handleSave() {
    if (!isValid) {
      return;
    }

    if (!spec.secretName) {
      spec.secretName = name;
    }

    const variables = {
      name,
      namespace,
      params: spec,
    };
    createOAuth2ClientMutation({ variables });
  }
  const breadcrumbItems = [{ name: 'OAuth Clients', path: '/' }, { name: '' }];

  return (
    <>
      <PageHeader
        title={'Create OAuth Client'}
        breadcrumbItems={breadcrumbItems}
        actions={
          <Button
            onClick={handleSave}
            disabled={!isValid}
            option="emphasized"
            aria-label="submit-form"
          >
            Create
          </Button>
        }
      />
      <OAuthClientForm
        spec={spec}
        onChange={(spec, isValid, name) => {
          setSpec(spec);
          setName(name);
          setIsValid(isValid);
        }}
        isCreate={true}
        namespace={namespace}
      />
    </>
  );
}
