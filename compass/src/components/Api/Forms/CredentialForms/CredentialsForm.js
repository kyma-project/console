import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Popover, Button } from 'fundamental-react';
import './style.scss';

import OAuthCredentialsForm, {
  CREDENTIAL_TYPE_OAUTH,
} from './OAuthCredentialsForm';
export const CREDENTIAL_TYPE_NONE = 'None';
export const CREDENTIAL_TYPE_PLACEHOLDER = 'Choose credentials type';

const availableCredentialTypes = [CREDENTIAL_TYPE_OAUTH, CREDENTIAL_TYPE_NONE];

CredentialsForm.propTypes = {
  updateState: PropTypes.func.isRequired,
  credentials: PropTypes.object.isRequired,
};

CredentialsForm.defaultProps = {
  defaultApiData: {
    oAuth: {
      clientId: '',
      clientSecret: '',
      url: '',
    },
    type: CREDENTIAL_TYPE_NONE,
  },
};

export default function CredentialsForm({ updateState, credentials }) {
  const credentialTypesList = (
    <Menu>
      <Menu.List>
        {availableCredentialTypes.map(credentialType => (
          <Menu.Item
            onClick={() => updateState({ type: credentialType })}
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
      <Dropdown>
        <Popover
          body={credentialTypesList}
          control={dropdownControl}
          widthSizingType="matchTarget"
        />
      </Dropdown>

      {credentials.type === CREDENTIAL_TYPE_OAUTH && (
        <OAuthCredentialsForm
          updateState={updateState}
          oAuthData={credentials.oAuth}
        />
      )}
    </section>
  );
}
