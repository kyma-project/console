import React from 'react';
import PropTypes from 'prop-types';

import TextFormItem from './TextFormItem';

CredentialsForm.propTypes = {
  updateState: PropTypes.func.isRequired,
};

export default function CredentialsForm({ updateState }) {
  const [oAuthCredentials, setOAuthCredentials] = React.useState({
    clientId: '',
    clientSecret: '',
    url: '',
  });

  function updateOAuth(key, value) {
    const updatedCredentials = {
      ...oAuthCredentials,
      [key]: value,
    };
    setOAuthCredentials(updatedCredentials);
    updateState({ oAuth: updatedCredentials });
  }

  return (
    <form>
      <TextFormItem
        inputKey="client-id"
        required
        type="password"
        label="Client ID"
        onChange={e => updateOAuth('clientId', e.target.value)}
      />
      <TextFormItem
        inputKey="client-secret"
        required
        type="password"
        label="Client Secret"
        onChange={e => updateOAuth('clientSecret', e.target.value)}
      />
      <TextFormItem
        inputKey="url"
        required
        type="url"
        label="Url"
        onChange={e => updateOAuth('url', e.target.value)}
      />
    </form>
  );
}
