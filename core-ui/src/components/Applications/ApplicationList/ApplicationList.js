import React, { useContext, useEffect, useState } from 'react';
import {
  PageHeader,
  GenericList,
  Spinner,
  easyHandleDelete,
} from 'react-shared';
import { GET_COMPASS_APPLICATIONS, GET_KYMA_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import { APPLICATIONS_EVENT_SUBSCRIPTION } from 'gql/subscriptions';
import handleApplicationEvent from './wsHandler';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';
import Badge from 'fundamental-react/Badge/Badge';
import { useNotification } from 'react-shared';
// import ConnectApplicationModal from '../ConnectApplicationModal/ConnectApplicationModal';
// import LuigiClient from '@kyma-project/luigi-client';
import ModalWithForm from '../../ModalWithForm/ModalWithForm';
import RegisterApplicationForm from '../RegisterApplication/RegisterApplicationForm';

// function navigateToApplicationDetails(applicationName) {
//   LuigiClient.linkManager().navigate(`details/${applicationName}`)}
// }

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
    onCompleted: kymaAppsQueryResult =>
      handleKymaAppsChange(kymaAppsQueryResult, applicationList),
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

  function handleKymaAppsChange(kymaAppsQueryResult, compassApps = []) {
    if (!kymaAppsQueryResult || !kymaAppsQueryResult.applications) return;
    const newAppList = [...compassApps];

    kymaAppsQueryResult.applications.forEach(kymaApp => {
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

  const actions = [
    {
      name: 'Delete',
      handler: app =>
        easyHandleDelete(
          'Application',
          app.name,
          unregisterApp,
          {
            variables: { id: app.id },
          },
          'unregisterApplication',
          notificationManager,
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
      // onClick={() => navigateToApplicationDetails(item.name)}
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
  const RegisterApp = () => (
    <ModalWithForm
      title="Register application"
      button={{ text: 'Register application', glyph: 'add' }}
      id="register-application-modal"
      renderForm={props => (
        <RegisterApplicationForm
          {...props}
          // onCompleted={navigateToApplicationDetails}
        />
      )}
    />
  );

  return (
    <>
      <PageHeader title="Applications" />
      <GenericList
        actionsStandaloneItems={1}
        actions={actions}
        entries={applicationList}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        extraHeaderContent={<RegisterApp />}
      />

      {/* <ul>
        {applicationList.map(app => (
          <li
            key={app.name}>
            {app.name}<ConnectApplicationModal applicationId={app.id}/>
          </li>
        ))}
      </ul> */}
    </>
  );
}
