import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, YamlEditorProvider } from 'react-shared';

import { PODS_TITLE } from 'shared/constants';
import PodList from './PodList/PodList';

Pods.propTypes = { namespace: PropTypes.string.isRequired };

export default function Pods({ namespace }) {
  return (
    <YamlEditorProvider>
      <PageHeader title={PODS_TITLE} />
      <PodList namespace={namespace} />
    </YamlEditorProvider>
  );
}
