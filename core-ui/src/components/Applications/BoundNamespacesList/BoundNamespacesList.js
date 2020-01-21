import React from 'react';
import { GenericList } from 'react-shared';
import LuigiClient from '@kyma-project/luigi-client';

export default function BoundNamespacesList({ data }) {
  const actions = [
    {
      name: 'Unbind',
      handler: () => {},
    },
  ];

  const headerRenderer = () => ['Name'];

  const rowRenderer = item => [item];

  return (
    <>
      <GenericList
        title="Namespace Binding"
        actions={actions}
        entries={data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </>
  );
}
