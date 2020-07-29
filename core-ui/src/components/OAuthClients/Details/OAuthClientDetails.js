import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import { PageHeader, useNotification, easyHandleDelete } from 'react-shared';
import { Button } from 'fundamental-react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_OAUTH_CLIENT } from 'gql/queries';
import { DELETE_OAUTH_CLIENT } from 'gql/mutations';
import OAuthClientStatus from '../Status/OAuthClientStatus';
import OAuthClientSecret from './OAuthClientSecret';

OAuthClientsDetails.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function OAuthClientsDetails({ namespace, name }) {
  const notificationManager = useNotification();

  const { data, loading, error } = useQuery(GET_OAUTH_CLIENT, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
  });

  const [deleteClient] = useMutation(DELETE_OAUTH_CLIENT);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  const breadcrumbs = [{ name: 'OAuth Clients', path: '/' }, { name: '' }];

  const actions = (
    <>
      <Button onClick={() => LuigiClient.linkManager().navigate('edit')}>
        Edit
      </Button>
      <Button
        onClick={() => {
          easyHandleDelete(
            'OAuth Client',
            name,
            deleteClient,
            { variables: { name, namespace } },
            'deleteOAuth2Client',
            notificationManager,
            () =>
              LuigiClient.linkManager()
                .fromClosestContext()
                .navigate('/'),
          );
        }}
        option="light"
        type="negative"
      >
        Delete
      </Button>
    </>
  );

  return (
    <>
      <PageHeader title={name} breadcrumbItems={breadcrumbs} actions={actions}>
        <PageHeader.Column title="Status">
          <OAuthClientStatus error={data.oAuth2Client.error} />
        </PageHeader.Column>
      </PageHeader>
      <OAuthClientSecret
        namespace={namespace}
        name={data.oAuth2Client.spec.secretName}
      />
    </>
  );
}
