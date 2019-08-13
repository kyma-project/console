import React from 'react';
import PropTypes from 'prop-types';
import TextFormItem from './../TextFormItem';

export const CREDENTIAL_TYPE_OAUTH = 'OAuth';

OAuthCredentialsForm.propTypes = {
  updateState: PropTypes.func.isRequired,
};

export default function OAuthCredentialsForm({ updateState }) {
  const [oAuthCredentials, setOAuthCredentials] = React.useState({
    clientId: '',
    clientSecret: '',
    url: '',
  });

  function areAllFieldsFilled(credentials) {
    // in OAuth, all fields are required
    return Object.values(credentials).every(val => val);
  }

  function updateOAuth(key, value) {
    const updatedCredentials = {
      ...oAuthCredentials,
      [key]: value,
    };
    setOAuthCredentials(updatedCredentials);

    updateState({
      oAuth: updatedCredentials,
      isFormReady: areAllFieldsFilled(updatedCredentials),
    });
  }

  return (
    <form className="fd-has-margin-top-medium">
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
