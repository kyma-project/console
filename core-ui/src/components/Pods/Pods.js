import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, YamlEditorProvider } from 'react-shared';

import PodList from './PodList/PodList';
import { TOOLBAR_TITLE } from './constants';

Services.propTypes = { namespace: PropTypes.string.isRequired };

export default function Services({ namespace }) {
  return (
    <YamlEditorProvider>
      <PageHeader title={TOOLBAR_TITLE} />
      <PodList namespace={namespace} />
    </YamlEditorProvider>
  );
}
