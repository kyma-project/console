import React from 'react';
import PropTypes from 'prop-types';
import OAuthClientForm from '../Form/OAuthClientForm';

CreateOAuthClient.propTypes = { namespace: PropTypes.string.isRequired };

const emptySpec = {
  grantTypes: [],
  responseTypes: [],
  scope: 'read',
  secretName: '',
};

export default function CreateOAuthClient({ namespace }) {
  const [spec, setSpec] = React.useState(emptySpec);

  return (
    <OAuthClientForm
      spec={spec}
      onChange={(spec, isValid) => {
        setSpec(spec);
        console.log(isValid);
        console.log(spec);
      }}
    />
  );
}
