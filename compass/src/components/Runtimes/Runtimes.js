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
  // const { data, loading, error } = useQuery(GET_RUNTIMES, {
  //   fetchPolicy: 'cache-and-network',
  // });
  // const headerRenderer = () => ['Name', 'Description', 'Scenarios', 'Status'];

  // const rowRenderer = runtime => [
  //   <span
  //     className="link"
  //     onClick={() =>
  //       LuigiClient.linkManager().navigate(`details/${runtime.id}`)
  //     }
  //   >
  //     {runtime.name}
  //   </span>,
  //   runtime.description ? runtime.description : EMPTY_TEXT_PLACEHOLDER,
  //   <ScenariosDisplay scenarios={runtime.labels.scenarios || []} />,
  //   <StatusBadge
  //     status={
  //       runtime.status && runtime.status.condition
  //         ? runtime.status.condition
  //         : 'UNKNOWN'
  //     }
  //   />,
  // ];

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;
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
          <InfiniteScroll searchQuery={searchQuery} />
        </Panel.Body>
      </Panel>
    </>
  );
};

export default Runtimes;
