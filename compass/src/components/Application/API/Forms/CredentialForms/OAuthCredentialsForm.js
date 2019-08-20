import React from 'react';
import PropTypes from 'prop-types';
import TextFormItem from '../../../../Shared/TextFormItem';

export const CREDENTIAL_TYPE_OAUTH = 'OAuth';

OAuthCredentialsForm.propTypes = {
  updateState: PropTypes.func.isRequired,
  defaultApiData: PropTypes.object,
};

OAuthCredentialsForm.defaultProps = {
  defaultApiData: {
    clientId: '',
    clientSecret: '',
    url: '',
  },
};

export default function OAuthCredentialsForm({ updateState, defaultApiData }) {
  const [oAuthCredentials, setOAuthCredentials] = React.useState(
    defaultApiData,
  );

  function updateOAuth(key, value) {
    const updatedCredentials = {
      ...oAuthCredentials,
      [key]: value,
    };
    setOAuthCredentials(updatedCredentials);

    updateState({ oAuth: updatedCredentials });
  }

  return (
    <section className="fd-has-margin-top-medium">
      <TextFormItem
        inputKey="client-id"
        required
        type="password"
        label="Client ID"
        onChange={e => updateOAuth('clientId', e.target.value)}
        defaultValue={defaultApiData.clientId}
      />
      <TextFormItem
        inputKey="client-secret"
        required
        type="password"
        label="Client Secret"
        onChange={e => updateOAuth('clientSecret', e.target.value)}
        defaultValue={defaultApiData.clientSecret}
      />
      <TextFormItem
        inputKey="url"
        required
        type="url"
        label="Url"
        onChange={e => updateOAuth('url', e.target.value)}
        defaultValue={defaultApiData.url}
      />
    </section>
  );
}
