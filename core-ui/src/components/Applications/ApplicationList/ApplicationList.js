import React, { useContext, useEffect, useState } from 'react';
import { PageHeader, GenericList, Spinner, handleDelete } from 'react-shared';
import { GET_COMPASS_APPLICATIONS, GET_KYMA_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import { APPLICATIONS_EVENT_SUBSCRIPTION } from 'gql/subscriptions';
import handleApplicationEvent from './wsHandler';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';
import Badge from 'fundamental-react/Badge/Badge';
import { useNotification } from 'contexts/notifications';

export default function ApplicationList() {
  const compassGqlClient = useContext(CompassGqlContext);
  const notificationManager = useNotification();
  const [applicationList, setApplicationList] = useState([]);
  const {
    data: compassQueryResult,
    error,
    loading,
    refetch: refetchCompassQuery,
  } = useQuery(GET_COMPASS_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
    onCompleted: compassApps => {
      handleKymaAppsChange(
        kymaAppsQuery.data,
        compassApps ? compassApps.applications.data : [],
      );
    },
  });

  const kymaAppsQuery = useQuery(GET_KYMA_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: kymaApps => handleKymaAppsChange(kymaApps, applicationList),
  });

  useEffect(() => {
    if (!compassQueryResult || !compassQueryResult.applications) {
      return;
    }
    setApplicationList(compassQueryResult.applications.data);
  }, [compassQueryResult, setApplicationList]);

  useEffect(() => {
    if (!kymaAppsQuery.subscribeToMore) return;
    kymaAppsQuery.subscribeToMore({
      document: APPLICATIONS_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        return handleApplicationEvent(
          subscriptionData.data.applicationEvent,
          prev,
          refetchCompassQuery,
        );
      },
    });
  }, [kymaAppsQuery, refetchCompassQuery]);

  useEffect(() => {
    if (!kymaAppsQuery.subscribeToMore) return;
    kymaAppsQuery.subscribeToMore({
      document: APPLICATIONS_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        return handleApplicationEvent(
          subscriptionData.data.applicationEvent,
          prev,
          refetchCompassQuery,
        );
      },
    });
  }, [kymaAppsQuery, refetchCompassQuery]);

  function handleKymaAppsChange(kymaApps = [], compassApps = []) {
    const newAppList = [...compassApps];

    kymaApps.applications.forEach(kymaApp => {
      const localAppEntry = newAppList.find(app => app.name === kymaApp.name);

      if (!localAppEntry) return; // got a Kyma app that has not been registered in Compass

      localAppEntry.status = kymaApp.status || 'installed'; // TODO
      localAppEntry.enabledInNamespaces = kymaApp.enabledInNamespaces;
    });
  }

  const [unregisterApp] = useMutation(UNREGISTER_APPLICATION, {
    client: compassGqlClient,
    refetchQueries: [{ query: GET_COMPASS_APPLICATIONS }],
  });

  async function handleApplicationUnregister(id, name) {
    try {
      const result = await unregisterApp({
        variables: { id },
      });
      const isSuccess =
        result.data &&
        result.data.unregisterApplication &&
        result.data.unregisterApplication.id === id;
      if (isSuccess) {
        notificationManager.notify({
          content: `Application ${name} deleted`,
          title: 'Success',
          color: '#107E3E',
          icon: 'accept',
          autoClose: true,
        });
      }
    } catch (e) {
      notificationManager.notify({
        content: `Error while removing application ${name}: ${e.message}`,
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
        autoClose: false,
      });
    }
  }

  const actions = [
    {
      name: 'Delete',
      handler: app =>
        handleDelete(
          'Application',
          app.id,
          app.name,
          handleApplicationUnregister,
        ),
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

  if (error) return `Error! ${error.message}`;
  if (loading) return <Spinner />;

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
