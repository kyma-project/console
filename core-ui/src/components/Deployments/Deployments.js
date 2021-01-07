import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, YamlEditorProvider } from 'react-shared';

import { DEPLOYMENTS_TITLE } from 'shared/constants';
import DeploymentList from './DeploymentList/DeploymentList';

Deployments.propTypes = { namespace: PropTypes.string.isRequired };

export default function Deployments({ namespace }) {
  return (
    <YamlEditorProvider>
      <PageHeader title={DEPLOYMENTS_TITLE} />
      <DeploymentList namespace={namespace} />
    </YamlEditorProvider>
  );
}
