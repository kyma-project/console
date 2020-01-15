import React, { useContext } from 'react';
import { PageHeader, GenericList, Spinner } from 'react-shared';
import { GET_APPLICATIONS } from 'gql/queries';
import { useQuery } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';

export default function ApplicationList() {
  const compassGqlClient = useContext(CompassGqlContext);
  const { data, error, loading, refetch } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'no-cache',
    client: compassGqlClient,
  });

  const actions = [];

  const headerRenderer = () => ['Name'];

  const rowRenderer = item => [
    <span
      className="link"
      data-test-id="app-name"
      //   onClick={() => LuigiClient.linkManager().navigate(`details/${item.name}`)}
    >
      {item.name}
    </span>,
  ];

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <PageHeader title="Applications" />
      <GenericList
        actions={actions}
        entries={data.applications.data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        // extraHeaderContent={<CreateLambdaModal />}
      />
    </>
  );
}
