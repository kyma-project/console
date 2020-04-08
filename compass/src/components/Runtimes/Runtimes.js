import React, { useState } from 'react';

import { PageHeader, StatusBadge } from 'react-shared';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';

import { GET_RUNTIMES } from './gql';
import InfiniteList from './InfiniteList';
import { Panel } from 'fundamental-react';
import SearchInput from './SearchInput';
import LuigiClient from '@luigi-project/client';

const runtimeHeaderRenderer = () => [
  'Name',
  'Description',
  'Scenarios',
  'Status',
];

const runtimeRowRenderer = r => [
  [
    'name',
    <span
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`details/${r.id}`)}
    >
      {r.name}
    </span>,
  ],
  ['desc', r.description || '-'],
  ['scenarios', <ScenariosDisplay scenarios={r.labels.scenarios || []} />],
  [
    'status',
    <StatusBadge
      status={r.status && r.status.condition ? r.status.condition : 'UNKNOWN'}
    />,
  ],
];

const Runtimes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <>
      <PageHeader title="Runtimes" />
      <Panel className="fd-has-margin-m">
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Actions>
            <SearchInput handleQueryChange={setSearchQuery} />
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body className="fd-has-padding-none">
          <InfiniteList
            query={GET_RUNTIMES}
            searchQuery={searchQuery}
            noMoreEntriesMessage="No more runtimes to show"
            headerRenderer={runtimeHeaderRenderer}
            rowRenderer={runtimeRowRenderer}
          />
        </Panel.Body>
      </Panel>
    </>
  );
};

export default Runtimes;
