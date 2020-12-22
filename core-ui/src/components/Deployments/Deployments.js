import React from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader,
  YamlEditorProvider,
  DEPLOYMENTS_TITLE,
} from 'react-shared';

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
