import React, { useContext, useEffect, useState } from 'react';
import { PageHeader, GenericList, Spinner } from 'react-shared';
import { GET_COMPASS_APPLICATIONS, GET_KYMA_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';
import Badge from 'fundamental-react/Badge/Badge';
import LuigiClient from '@kyma-project/luigi-client';

export default function ApplicationList() {
  const compassGqlClient = useContext(CompassGqlContext);

  const [applicationList, setApplicationList] = useState([]);
  const { data: compassQueryResult, error, loading } = useQuery(
    GET_COMPASS_APPLICATIONS,
    {
      fetchPolicy: 'cache-and-network',
      client: compassGqlClient,
      onCompleted: compassApps => {
        handleKymaAppsChange(kymaAppsQuery.data, compassApps.applications.data);
      },
    },
  );

  const kymaAppsQuery = useQuery(GET_KYMA_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: kymaApps => handleKymaAppsChange(kymaApps, applicationList),
  });

  useEffect(() => {
    if (!compassQueryResult || !compassQueryResult.applications) {
      return;
    }
    setApplicationList(compassQueryResult.applications.data);
  }, [compassQueryResult, compassQueryResult.applications, setApplicationList]);

  function handleKymaAppsChange(kymaApps = [], compassApps = []) {
    const newAppList = [...compassApps];

    kymaApps.applications.forEach(kymaApp => {
      const localAppEntry = newAppList.find(app => app.name === kymaApp.name);

      if (!localAppEntry) return; // got a Kyma app that has not been registered in Compass

      localAppEntry.status = 'installed';
      localAppEntry.enabledInNamespaces = kymaApp.enabledInNamespaces;
    });
  }

  const [unregisterApp] = useMutation(UNREGISTER_APPLICATION, {
    client: compassGqlClient,
  });

  const actions = [
    {
      name: 'Delete',
      handler: app => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: `Remove ${app.name}`,
            body: `Are you sure you want to delete ${app.name}?`,
            buttonConfirm: 'Delete',
            buttonDismiss: 'Cancel',
          })
          .then(() => unregisterApp({ variables: { id: app.id } }))
          .catch(e =>
            LuigiClient.uxManager().showAlert({
              text: `An error occurred while deleting ${app.name}: ${e.message}`,
              type: 'error',
              closeAfter: 10000,
            }),
          );
      },
    },
    { name: 'Install', handler: () => {}, skipAction: app => false },
    { name: 'Uninstall', handler: () => {}, skipAction: app => false },
  ];

  const headerRenderer = () => [
    'Name',
    'Provider name',
    'Status',
    'Bound namespaces',
    'Connected',
  ];

  const rowRenderer = item => [
    <span
      className="link"
      data-test-id="app-name"
      //   onClick={() => LuigiClient.linkManager().navigate(`details/${item.name}`)}
    >
      {item.name}
    </span>,
    item.providerName,
    <Badge modifier="filled">{item.status}</Badge>,
    Array.isArray(item.enabledInNamespaces)
      ? item.enabledInNamespaces.map(n => (
          <Badge key={n} className="fd-has-margin-right-tiny">
            {n}
          </Badge>
        ))
      : '-',
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
        entries={applicationList}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        // extraHeaderContent={<CreateLambdaModal />}
      />
    </>
  );
}
