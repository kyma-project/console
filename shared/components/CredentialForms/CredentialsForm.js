import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '../Dropdown/Dropdown';

import {
  OAuthCredentialsForm,
  CREDENTIAL_TYPE_OAUTH,
  oAuthRefPropTypes,
} from './OAuthCredentialsForm';
import {
  BasicCredentialsForm,
  CREDENTIAL_TYPE_BASIC,
  basicRefPropTypes,
} from './BasicCredentialsForm';
export const CREDENTIAL_TYPE_NONE = 'None';

CredentialsForm.propTypes = {
  credentialType: PropTypes.string.isRequired,
  setCredentialType: PropTypes.func.isRequired,
  credentialRefs: PropTypes.shape({
    oAuth: oAuthRefPropTypes,
    basic: basicRefPropTypes,
  }).isRequired,
  defaultValues: PropTypes.shape({
    oAuth: PropTypes.object,
  }),
};

export function CredentialsForm({
  credentialRefs,
  credentialType,
  setCredentialType,
  defaultValues,
}) {
  const credentialsList = {
    [CREDENTIAL_TYPE_NONE]: CREDENTIAL_TYPE_NONE,
    [CREDENTIAL_TYPE_OAUTH]: CREDENTIAL_TYPE_OAUTH,
    [CREDENTIAL_TYPE_BASIC]: CREDENTIAL_TYPE_BASIC,
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
      {credentialType === CREDENTIAL_TYPE_BASIC && (
        <BasicCredentialsForm
          refs={credentialRefs.basic}
          defaultValues={defaultValues && defaultValues.basic}
        />
      )}
    </section>
  );
}
