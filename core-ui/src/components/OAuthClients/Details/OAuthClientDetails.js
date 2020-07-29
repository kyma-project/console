import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import { PageHeader, useNotification, easyHandleDelete } from 'react-shared';
import { Button } from 'fundamental-react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_OAUTH_CLIENT } from 'gql/queries';
import { DELETE_OAUTH_CLIENT, UPDATE_OAUTH_CLIENT } from 'gql/mutations';
import OAuthClientStatus from '../Status/OAuthClientStatus';
import OAuthClientSecret from './Secret/OAuthClientSecret';
import OAuthClientForm from '../Form/OAuthClientForm';
import OAuthClientSpecPanel from './OAuthClientSpecPanel';

OAuthClientsDetails.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
export default function OAuthClientsDetails({ namespace, name }) {
  const notificationManager = useNotification();
  const [isEditMode, setEditMode] = React.useState(false);
  const [spec, setSpec] = React.useState(null);
  const [isSpecValid, setSpecValid] = React.useState(true);

  const { data, loading, error } = useQuery(GET_OAUTH_CLIENT, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
  });

  const [deleteClient] = useMutation(DELETE_OAUTH_CLIENT);
  const [updateClient] = useMutation(UPDATE_OAUTH_CLIENT, {
    refetchQueries: () => [
      { query: GET_OAUTH_CLIENT, variables: { namespace, name } },
    ],
  });

  React.useEffect(() => {
    if (data && data.oAuth2Client) {
      setSpec(data.oAuth2Client.spec);
    }
  }, [data, isEditMode]);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  const breadcrumbs = [{ name: 'OAuth Clients', path: '/' }, { name: '' }];

  const saveClient = async () => {
    delete spec.__typename;
    try {
      await updateClient({
        variables: {
          name,
          namespace,
          generation: data.oAuth2Client.generation,
          params: spec,
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
      <Button onClick={saveClient} disabled={!isSpecValid}>
        Save
      </Button>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
    </>
  ) : (
    <>
      <Button onClick={() => setEditMode(true)}>Edit</Button>
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

  const specChanged = (spec, isValid) => {
    setSpec(spec);
    setSpecValid(isValid);
  };

  return (
    <>
      <PageHeader title={name} breadcrumbItems={breadcrumbs} actions={actions}>
        <PageHeader.Column title="Status">
          <OAuthClientStatus error={data.oAuth2Client.error} />
        </PageHeader.Column>
      </PageHeader>
      {spec &&
        (isEditMode ? (
          <OAuthClientForm spec={spec} onChange={specChanged} />
        ) : (
          <OAuthClientSpecPanel spec={spec} />
        ))}
      <OAuthClientSecret
        namespace={namespace}
        name={data.oAuth2Client.spec.secretName}
      />
    </>
  );
}
