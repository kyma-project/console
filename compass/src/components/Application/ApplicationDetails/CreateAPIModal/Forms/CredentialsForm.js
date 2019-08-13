import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'fundamental-react';
import { Button, Dropdown } from '@kyma-project/react-components';

import OAuthCredentialsForm, {
  CREDENTIAL_TYPE_OAUTH,
} from './CredentialForms/OAuthCredentialsForm';
export const CREDENTIAL_TYPE_NONE = 'None';
export const CREDENTIAL_TYPE_PLACEHOLDER = 'Choose credentials type';

const availableCredentialTypes = [CREDENTIAL_TYPE_OAUTH, CREDENTIAL_TYPE_NONE];

CredentialsForm.propTypes = {
  updateState: PropTypes.func.isRequired,
  credentialsType: PropTypes.oneOf(availableCredentialTypes),
};

export default function CredentialsForm({ updateState, credentialsType }) {
  const credentialTypesList = (
    <Menu>
      <Menu.List>
        {availableCredentialTypes.map(credentialType => (
          <Menu.Item onClick={() => updateState({ type: credentialType })}>
            {credentialType}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );

  return (
    <section>
      <p>Credentials type</p>
      <Dropdown
        control={
          <Button dropdown>
            <span>{credentialsType}</span>
          </Button>
        }
        placement="bottom"
      >
        {credentialTypesList}
      </Dropdown>

      {credentialsType === CREDENTIAL_TYPE_OAUTH && (
        <OAuthCredentialsForm updateState={updateState} />
      )}
    </section>
  );
}
