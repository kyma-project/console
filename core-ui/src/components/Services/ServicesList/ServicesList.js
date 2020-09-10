import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import Moment from 'react-moment';
import { Link } from 'fundamental-react';
import { useQuery } from '@apollo/react-hooks';
import { GenericList, Labels, EMPTY_TEXT_PLACEHOLDER } from 'react-shared';

import { GET_SERVICES } from 'gql/queries';

ServicesList.propTypes = { namespace: PropTypes.string.isRequired };

export default function ServicesList({ namespace }) {
  const navigateToServiceDetails = service =>
    LuigiClient.linkManager().navigate(
      `details/${service.name}`,
    );

  const { data, error, loading } = useQuery(GET_SERVICES, {
    variables: { namespace },
    fetchPolicy: 'no-cache',
  });

  const actions = [
    {
      name: 'Details',
      handler: navigateToServiceDetails,
    },
  ];

  const listOfEndpoints = entry => {
    if (entry.ports && entry.ports.length) {
      return entry.ports.map(port => {
        const portValue = `${entry.name}.${namespace}: ${port.port} ${port.serviceProtocol}`;
        return <div key={portValue}>{portValue}</div>;
      });
    } else {
      return <span> {EMPTY_TEXT_PLACEHOLDER} </span>;
    }
  };

  const headerRenderer = () => [
    'Name',
    'Cluster IP',
    'Internal endpoints',
    'Age',
    'Labels',
  ];

  const rowRenderer = entry => [
    <Link onClick={() => navigateToServiceDetails(entry)}>{entry.name}</Link>,
    <span>{entry.clusterIP || EMPTY_TEXT_PLACEHOLDER}</span>,
    listOfEndpoints(entry),
    <Moment unix fromNow>
      {entry.creationTimestamp}
    </Moment>,
    <Labels labels={entry.labels} />,
  ];

  return (
    <GenericList
      title="Services"
      actions={actions}
      entries={data?.services || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      server={error}
      loading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
