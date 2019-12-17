import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Popover, Button } from 'fundamental-react';
import './CredentialsForm.scss';

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

  return (
    <section className="credentials-form">
      <p>Credentials type</p>
      <Dropdown>
        <Popover
          body={credentialTypesList}
          control={
            <Button
              className="fd-dropdown__control"
              glyph="navigation-down-arrow"
              typeAttr="button"
            >
              {credentialType}
            </Button>
          }
          widthSizingType="matchTarget"
          placement="bottom"
        />
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
