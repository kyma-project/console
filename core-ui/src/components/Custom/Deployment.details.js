import React, { useState } from 'react';

import { useGet } from 'react-shared';

export const DeploymentDetails = ({
  PredefinedRenderer,
  resourceUrl,
  resourceName,
  resourceType,
  namespace,
}) => {
  const [resource, setResource] = React.useState();

  const { loading = true, error } = useGet(
    `/apis/apps/v1/namespaces/${namespace}/deployments/${resourceName}`,
    setResource,
    namespace,
  );

  return (
    <>
      <h1 style={{ fontSize: '5em', color: 'tomato' }}>
        I made the data call on my own!
      </h1>
    </>
  );
};
