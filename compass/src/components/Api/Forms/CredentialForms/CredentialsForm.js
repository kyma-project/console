import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'components/Shared/Dropdown/Dropdown';

import OAuthCredentialsForm, {
  CREDENTIAL_TYPE_OAUTH,
  oAuthRefPropTypes,
} from './OAuthCredentialsForm';
export const CREDENTIAL_TYPE_NONE = 'None';

CredentialsForm.propTypes = {
  credentialType: PropTypes.string.isRequired,
  setCredentialType: PropTypes.func.isRequired,
  credentialRefs: PropTypes.shape({
    oAuth: oAuthRefPropTypes,
  }).isRequired,
  defaultValues: PropTypes.shape({
    oAuth: PropTypes.object,
  }),
};

export default function CredentialsForm({
  credentialRefs,
  credentialType,
  setCredentialType,
  defaultValues,
}) {
  const credentialsList = {
    [CREDENTIAL_TYPE_NONE]: CREDENTIAL_TYPE_NONE,
    [CREDENTIAL_TYPE_OAUTH]: CREDENTIAL_TYPE_OAUTH,
  };

  return (
    <section className="credentials-form">
      <p>Credentials type</p>
      <Dropdown
        options={credentialsList}
        selectedOption={credentialType}
        onSelect={setCredentialType}
        width="100%"
      />

      {credentialType === CREDENTIAL_TYPE_OAUTH && (
        <OAuthCredentialsForm
          refs={credentialRefs.oAuth}
          defaultValues={defaultValues && defaultValues.oAuth}
        />
      )}
    </section>
  );
}
