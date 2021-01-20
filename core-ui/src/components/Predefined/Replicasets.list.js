import React, { useState } from 'react';

import { useGet } from 'react-shared';

const MySuperPredefinedList = ({ resourceUrl, resourceType, namespace }) => {
  const [resources, setResources] = React.useState([]);

  const { loading = true, error } = useGet(
    `/apis/apps/v1/namespaces/${namespace}/replicasets`,
    setResources,
    namespace,
  );

  return (
    <>
      <h1 style={{ fontSize: '5em', color: 'tomato' }}>
        This is predefined but doesn't use generic renderer
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '4em',
        }}
      >
        {resources.map(r => (
          <span key={r.metadata.resourceVersion}>{r.metadata.name}</span>
        ))}
      </div>
    </>
  );
};

export const ReplicasetsList = DefaultRenderer => MySuperPredefinedList;
