import React from 'react';
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

const Runtimes = () => {
  const { data, loading, error } = useQuery(GET_RUNTIMES, {
    fetchPolicy: 'cache-and-network',
  });
  const headerRenderer = () => ['Name', 'Description', 'Scenarios', 'Status'];

  const rowRenderer = runtime => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${runtime.id}`)
      }
    >
      {runtime.name}
    </span>,
    runtime.description ? runtime.description : EMPTY_TEXT_PLACEHOLDER,
    <ScenariosDisplay scenarios={runtime.labels.scenarios || []} />,
    <StatusBadge
      status={
        runtime.status && runtime.status.condition
          ? runtime.status.condition
          : 'UNKNOWN'
      }
    />,
  ];

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <PageHeader title="Runtimes" />
      <GenericList
        entries={data.runtimes.data.slice(0, 10)}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        pagination={{
          totalCount: data.runtimes.totalCount,
          itemsPerPage: 10,
          currentPage: 1,
          onPageChange: pageNumber =>
            console.log('Page changed to', pageNumber),
        }}
      />
    </>
  );
};

export default Runtimes;
