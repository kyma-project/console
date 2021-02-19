import React from 'react';
import { GenericList } from 'react-shared';

export default function ApplicationServices({ spec }) {
  const headerRenderer = () => ['Name', 'APIs', 'Events'];

  const entries = spec.services.map(e => ({
    displayName: e.displayName,
    evenstCount: e.entries.filter(t => t.type === 'Events').length,
    apisCount: e.entries.filter(t => t.type === 'API').length,
  }));

  const rowRenderer = e => [e.displayName, e.evenstCount, e.apisCount];

  return (
    <GenericList
      title="Provided Services & Events"
      textSearchProperties={['displayName']}
      entries={entries}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      notFoundMessage="No services"
    />
  );
}
