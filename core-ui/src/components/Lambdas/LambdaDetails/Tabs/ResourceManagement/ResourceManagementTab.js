import React from 'react';

import ResourcesManagement from './ResourceManagement/ResourceManagement';

export default function ResourceManagementTab({ lambda }) {
  return <ResourcesManagement lambda={lambda} />;
}
