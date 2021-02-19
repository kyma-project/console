import React from 'react';
import { GenericList } from 'react-shared';

export default function ApplicationServices({ spec: applicationSpec }) {
  const headerRenderer = () => ['Name', 'APIs', 'Events'];

  const entries = applicationSpec.services.map(e => ({
    displayName: e.displayName,
    eventsCount: e.entries.filter(t => t.type === 'Events').length,
    apisCount: e.entries.filter(t => t.type === 'API').length,
  }));

  const rowRenderer = e => [e.displayName, e.apisCount, e.eventsCount];

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
