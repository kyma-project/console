import React from 'react';
import LuigiClient from '@luigi-project/client';
import Moment from 'react-moment';

import { PageHeader, GenericList, StatusBadge } from 'react-shared';

import { useQuery } from 'react-apollo';
import { BROKERS_QUERY } from './queries';

export default function ServiceBrokers() {
  const namespace = LuigiClient.getContext().namespaceId;

  const { data, loading, error } = useQuery(BROKERS_QUERY, {
    variables: { namespace },
  });

  const headerRenderer = () => ['Name', 'Age', 'Url', 'Status'];

  const rowRenderer = item => {
    return [
      item.name,
      <Moment unix fromNow>
        {item.creationTimestamp}
      </Moment>,
      item.url,
      (_ => {
        const status = item.status.ready === true ? 'RUNNING' : 'FAILED';
        const type = item.status.ready === true ? 'success' : 'error';

        return (
          <StatusBadge tooltipContent={item.status.message} type={type}>
            {status}
          </StatusBadge>
        );
      })(),
    ];
  };

  return (
    <article className="brokers-list">
      <PageHeader title="Service Brokers" aria-label="title" />
      <GenericList
        entries={data?.serviceBrokers?.filter(b => b) || []}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        showRootHeader={false}
        serverDataLoading={loading}
        serverDataError={error}
      />
    </article>
  );
}
