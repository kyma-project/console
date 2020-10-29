import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, YamlEditorProvider } from 'react-shared';

import ServicesList from './ServicesList/ServicesList';
import { TOOLBAR_TITLE } from './constants';

Services.propTypes = { namespace: PropTypes.string.isRequired };

export default function Services({ namespace }) {
  return (
    <YamlEditorProvider>
      <PageHeader title={TOOLBAR_TITLE} />
      <ServicesList namespace={namespace} />
    </YamlEditorProvider>
  );
}
