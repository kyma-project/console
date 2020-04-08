import React, { useState } from 'react';
import LuigiClient from '@luigi-project/client';

import {
  PageHeader,
  GenericList,
  EMPTY_TEXT_PLACEHOLDER,
  StatusBadge,
} from 'react-shared';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';
import { useQuery } from 'react-apollo';
import { GET_RUNTIMES } from './gql';
import InfiniteScroll from './InfiniteScroll';
import { Panel } from 'fundamental-react';
import SearchInput from './SearchInput';

const Runtimes = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <PageHeader title="Runtimes" />
      <Panel className="fd-has-margin-m">
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Actions>
            <SearchInput
              searchQuery={searchQuery}
              handleQueryChange={setSearchQuery}
            />
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body className="fd-has-padding-none">
          <InfiniteScroll
            searchQuery={searchQuery}
            headerRenderer={() => [
              'Name',
              'Description',
              'Scenarios',
              'Status',
            ]}
            rowRenderer={r => [
              ['name', r.name],
              ['desc', r.description || '-'],
              [
                'scenarios',
                <ScenariosDisplay scenarios={r.labels.scenarios || []} />,
              ],
              [
                'status',
                <StatusBadge
                  status={
                    r.status && r.status.condition
                      ? r.status.condition
                      : 'UNKNOWN'
                  }
                />,
              ],
            ]}
          />
        </Panel.Body>
      </Panel>
    </>
  );
};

export default Runtimes;
