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
export const CREDENTIAL_TYPE_EMPTY = 'Empty';

CredentialsForm.propTypes = {
  credentialType: PropTypes.string.isRequired,
  setCredentialType: PropTypes.func.isRequired,
  credentialRefs: PropTypes.shape({
    oAuth: oAuthRefPropTypes,
    basic: basicRefPropTypes,
  }).isRequired,
  defaultValues: PropTypes.shape({
    oAuth: PropTypes.object,
    basic: PropTypes.object,
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
    [CREDENTIAL_TYPE_EMPTY]: CREDENTIAL_TYPE_EMPTY,
  };

  const credentialsMessage = type => {
    if (type === CREDENTIAL_TYPE_NONE) {
      return 'AuthData request from runtime will be blocked until credentials are provided.';
    } else {
      return 'This credentials will be copied for every and each AuthData requests from the Runtime.';
    }
  };

  return (
    <section className="credentials-form">
      <p className="fd-has-color-text-3">Credentials type</p>
      <Dropdown
        options={credentialsList}
        selectedOption={credentialType}
        onSelect={setCredentialType}
        width="100%"
      />
      <p className="fd-has-color-text-3 fd-has-margin-bottom-small fd-has-margin-top-tiny">
        {credentialsMessage(credentialType)}
      </p>
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
