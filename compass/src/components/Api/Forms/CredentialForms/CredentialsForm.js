import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button } from 'fundamental-react';
import './style.scss';

import OAuthCredentialsForm, {
  CREDENTIAL_TYPE_OAUTH,
  oAuthRefs,
} from './OAuthCredentialsForm';
export const CREDENTIAL_TYPE_NONE = 'None';

const availableCredentialTypes = [CREDENTIAL_TYPE_OAUTH, CREDENTIAL_TYPE_NONE];

CredentialsForm.propTypes = {
  credentialType: PropTypes.string.isRequired,
  setCredentialType: PropTypes.func.isRequired,
  credentialRefs: PropTypes.shape({
    oAuth: oAuthRefs,
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
  const credentialTypesList = (
    <Menu>
      <Menu.List>
        {availableCredentialTypes.map(credentialType => (
          <Menu.Item
            onClick={() => setCredentialType(credentialType)}
            key={credentialType}
          >
            {credentialType}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );

  const dropdownControl = (
    <Button
      className="fd-dropdown__control"
      glyph="navigation-down-arrow"
      typeAttr="button"
    >
      {credentials.type}
    </Button>
  );

  return (
    <section className="credentials-form">
      <p>Credentials type</p>
      <Dropdown
        control={
          <Button dropdown typeAttr="button">
            <span>{credentialType}</span>
          </Button>
        }
        placement="bottom"
      >
        {credentialTypesList}
      </Dropdown>

      {credentialType === CREDENTIAL_TYPE_OAUTH && (
        <OAuthCredentialsForm
          refs={credentialRefs.oAuth}
          defaultValues={defaultValues && defaultValues.oAuth}
        />
      )}
    </section>
  );
}
