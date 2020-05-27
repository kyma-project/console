import React from 'react';

import { PageHeader, StatusBadge, useMicrofrontendContext } from 'react-shared';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';
import { getBadgeTypeForStatus } from './../Shared/getBadgeTypeForStatus';

import { GET_RUNTIMES } from './gql';
import InfiniteList from './InfiniteList';
import { Panel } from 'fundamental-react';
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
      type={getBadgeTypeForStatus(r.status)}
      status={r.status && r.status.condition ? r.status.condition : 'UNKNOWN'}
    />,
  ],
];

const Runtimes = () => {
  const { tenantId } = useMicrofrontendContext();

  return (
    <>
      <PageHeader title="Runtimes" />
      <Panel className="fd-has-margin-m">
        <Panel.Body className="fd-has-padding-none">
          <InfiniteList
            key={tenantId} // force rerender on tenant change
            query={GET_RUNTIMES}
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
