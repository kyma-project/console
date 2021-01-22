import React from 'react';
import PropTypes from 'prop-types';

import { PageHeader, YamlEditorProvider } from '../..';

ResourceDetails.propTypes = {
  resourceUrl: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  namespace: PropTypes.string,
  // isCompact: PropTypes.bool, // TODO: decide if needed
};

export function ResourceDetails(props) {
  if (!props.resourceUrl) {
    return <></>; // wait for the context update
  }
  return (
    <YamlEditorProvider>
      {/* <PageHeader title={props.resourceName} /> */}
      <Resource {...props} />
    </YamlEditorProvider>
  );
}

function Resource({ resourceUrl, namespace, resourceName }) {
  return (
    'This is a generic resource details component for resource ' + resourceName
  );
}
