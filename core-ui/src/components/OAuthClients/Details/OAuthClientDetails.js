import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_OAUTH_CLIENT } from 'gql/queries';

import ClientSecret from './Secret/OAuthClientSecret';
import ClientForm from '../Form/OAuthClientForm';
import SpecPanel from './OAuthClientSpecPanel';
import Header from './OAuthClientHeader';

OAuthClientsDetails.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function OAuthClientsDetails({ namespace, name }) {
  const [isEditMode, setEditMode] = React.useState(false);
  const [spec, setSpec] = React.useState(null);
  const [isSpecValid, setSpecValid] = React.useState(true);

  const { data, loading, error } = useQuery(GET_OAUTH_CLIENT, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace, name },
  });

  React.useEffect(() => {
    if (data && data.oAuth2Client) {
      setSpec(data.oAuth2Client.spec);
    }
  }, [data, isEditMode]);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  const specChanged = (spec, isValid) => {
    setSpec(spec);
    setSpecValid(isValid);
  };

  return (
    <>
      <Header
        client={data.oAuth2Client}
        canSave={isSpecValid}
        isEditMode={isEditMode}
        updatedSpec={spec || {}}
        setEditMode={setEditMode}
      />
      {spec &&
        (isEditMode ? (
          <ClientForm
            spec={spec}
            onChange={specChanged}
            namespace={namespace}
          />
        ) : (
          <SpecPanel spec={spec} />
        ))}
      <ClientSecret
        namespace={namespace}
        name={data.oAuth2Client.spec.secretName}
      />
    </>
  );
}
