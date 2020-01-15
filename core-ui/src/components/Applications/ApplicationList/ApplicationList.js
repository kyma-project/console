import React, { useContext } from 'react';
import { PageHeader, GenericList, Spinner, handleDelete } from 'react-shared';
import { GET_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';
import Badge from 'fundamental-react/Badge/Badge';

export default function ApplicationList() {
  const compassGqlClient = useContext(CompassGqlContext);
  const { data, error, loading, refetch } = useQuery(GET_APPLICATIONS, {
    // fetchPolicy: 'no-cache',
    client: compassGqlClient,
  });

  const [unregisterApp] = useMutation(UNREGISTER_APPLICATION, {
    client: compassGqlClient,
  });

  const actions = [
    {
      name: 'Delete',
      handler: app => {
        handleDelete(
          'Application',
          app.id,
          app.name,
          () => unregisterApp({ variables: { id: app.id } }),
          refetch,
        );
      },
    },
    { name: 'Install', handler: () => {}, skipAction: app => false },
    { name: 'Uninstall', handler: () => {}, skipAction: app => false },
  ];

  const headerRenderer = () => ['Name', 'Provider name', 'Status', 'Connected'];

  const rowRenderer = item => [
    <span
      className="link"
      data-test-id="app-name"
      //   onClick={() => LuigiClient.linkManager().navigate(`details/${item.name}`)}
    >
      {item.name}
    </span>,
    item.providerName,
    <Badge>available</Badge>,
    <Badge modifier="filled" type="success">
      Yes
    </Badge>,
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
        actionsStandaloneItems={1}
        actions={actions}
        entries={data.applications.data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        // extraHeaderContent={<CreateLambdaModal />}
      />
    </>
  );
}
