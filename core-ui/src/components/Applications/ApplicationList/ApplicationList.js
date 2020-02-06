import React, { useContext, useEffect, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import {
  PageHeader,
  GenericList,
  Spinner,
  easyHandleDelete,
  EMPTY_TEXT_PLACEHOLDER,
} from 'react-shared';
import { GET_COMPASS_APPLICATIONS, GET_KYMA_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import { APPLICATIONS_EVENT_SUBSCRIPTION } from 'gql/subscriptions';
import handleApplicationEvent from './wsHandler';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';
import Badge from 'fundamental-react/Badge/Badge';
import { useNotification } from 'react-shared';
import ModalWithForm from '../../ModalWithForm/ModalWithForm';
import RegisterApplicationForm from '../RegisterApplication/RegisterApplicationForm';
import './ApplicationList.scss';
import ApplicationStatus from '../ApplicationStatus/ApplicationStatus';

const STATUSES = {
  NOT_INSTALLED: 'NOT_INSTALLED',
  INSTALLED: 'INSTALLED',
};

function getSortedApplications(applications) {
  return applications.sort((app1, app2) => {
    if (!app1.status || app1.status === STATUSES.NOT_INSTALLED) return 1;
    if (!app2.status || app2.status === STATUSES.NOT_INSTALLED) return -1;
    return 0;
  });
}

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

      localAppEntry.status = kymaApp.status || STATUSES.INSTALLED;
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

  const rowRenderer = item => {
    return [
      <span
        className="link"
        data-test-id="app-name"
        onClick={() => LuigiClient.linkManager().navigate(`details/${item.id}`)}
      >
        {item.name}
      </span>,
      item.providerName || EMPTY_TEXT_PLACEHOLDER,
      <ApplicationStatus application={item} />,
      Array.isArray(item.enabledInNamespaces) && item.enabledInNamespaces.length
        ? item.enabledInNamespaces.map(n => (
            <Badge key={n} className="fd-has-margin-right-tiny">
              {n}
            </Badge>
          ))
        : EMPTY_TEXT_PLACEHOLDER,
      <Badge modifier="filled" disabled>
        No
      </Badge>,
    ];
  };

  if (error) return `Error! ${error.message}`;
  if (loading) return <Spinner />;

  const onCompleted = id => {
    notificationManager.notifySuccess({
      content: `Application created successfully`,
    });
    if (id) {
      LuigiClient.linkManager().navigate(`details/${id}`);
    }
  };

  const RegisterApp = () => (
    <ModalWithForm
      title="Register application"
      button={{ text: 'Register application', glyph: 'add' }}
      id="register-application-modal"
      renderForm={props => (
        <RegisterApplicationForm {...props} onCompleted={onCompleted} />
      )}
    />
  );

  return (
    <article className="application-list">
      <PageHeader title="Applications" />
      <GenericList
        actionsStandaloneItems={1}
        actions={actions}
        entries={getSortedApplications(applicationList)}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        extraHeaderContent={<RegisterApp />}
      />
    </article>
  );
}
