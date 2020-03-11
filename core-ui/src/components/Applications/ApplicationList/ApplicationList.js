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
import { Popover, Menu, Button, Badge } from 'fundamental-react';
import { Counter } from 'fundamental-react/Badge';
import { useNotification } from 'react-shared';
import ModalWithForm from '../../ModalWithForm/ModalWithForm';
import RegisterApplicationForm from '../RegisterApplication/RegisterApplicationForm';
import CreateApplicationFromTemplateModal from './../CreateApplicationFromTemplateModal/CreateApplicationFromTemplateModal';
import './ApplicationList.scss';
import ApplicationStatus, {
  STATUSES,
} from '../ApplicationStatus/ApplicationStatus';

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
    console.log(compassQueryResult.applications.data);
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
    console.log(kymaAppsQueryResult, compassApps);
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
  ];

  const headerRenderer = () => [
    'Name',
    'Provider name',
    'Status',
    'Bound namespaces',
    'Packages',
  ];

  const rowRenderer = item => {
    console.log(item);
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
      <Counter>{item.packages.totalCount}</Counter>,
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
      modalOpeningComponent={<Menu.Item>From scratch</Menu.Item>}
      id="register-application-modal"
      renderForm={props => (
        <RegisterApplicationForm {...props} onCompleted={onCompleted} />
      )}
    />
  );

  const extraHeaderContent = (
    <Popover
      body={
        <Menu>
          <Menu.List>
            <RegisterApp />
            <CreateApplicationFromTemplateModal />
          </Menu.List>
        </Menu>
      }
      control={<Button option="light">Create application...</Button>}
      widthSizingType="matchTarget"
      placement="bottom-end"
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
        extraHeaderContent={extraHeaderContent}
      />
    </article>
  );
}
