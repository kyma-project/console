import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, YamlEditorProvider } from 'react-shared';

import SecretList from './List/SecretList';
import { SECRETS_TITLE } from 'shared/constants';

Services.propTypes = { namespace: PropTypes.string.isRequired };

export default function Services({ namespace }) {
  return (
    <YamlEditorProvider>
      <PageHeader title={SECRETS_TITLE} />
      <SecretList namespace={namespace} />
    </YamlEditorProvider>
  );
}
