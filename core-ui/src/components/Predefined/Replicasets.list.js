import React, { useState } from 'react';

import { useGetList } from 'react-shared';

const MySuperPredefinedList = ({ resourceUrl, resourceType, namespace }) => {
  const { loading = true, error, data: resources } = useGetList(resourceUrl, {
    pollingInterval: 3000,
  });

  if (!Array.isArray(resources)) return 'Loading';

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
