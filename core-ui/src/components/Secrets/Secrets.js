import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, YamlEditorProvider } from 'react-shared';

import SecretList from './List/SecretList';
import { SECRETS_TITLE } from 'shared/constants';

Secrets.propTypes = { namespace: PropTypes.string.isRequired };

export default function Secrets({ namespace }) {
  return (
    <YamlEditorProvider>
      <PageHeader title={SECRETS_TITLE} />
      <SecretList namespace={namespace} />
    </YamlEditorProvider>
  );
}
