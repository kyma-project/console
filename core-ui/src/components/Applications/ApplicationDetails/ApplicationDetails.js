import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import ApplicationStatus from '../ApplicationStatus/ApplicationStatus';
import {
  Spinner,
  PageHeader,
  DetailsError,
  useNotification,
  Labels,
  EMPTY_TEXT_PLACEHOLDER,
} from 'react-shared';
import { GET_APPLICATION, GET_APPLICATION_COMPASS } from 'gql/queries';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';
import BoundNamespacesList from '../BoundNamespacesList/BoundNamespacesList';
import ConnectApplicationModal from '../ConnectApplicationModal/ConnectApplicationModal';
import { CompassGqlContext } from 'index';
import './ApplicationDetails.scss';
import { APPLICATIONS_EVENT_SUBSCRIPTION } from 'gql/subscriptions';

const ApplicationDetails = ({ appId }) => {
  const notificationManager = useNotification();
  const compassGqlClient = useContext(CompassGqlContext);

  const compassQuery = useQuery(GET_APPLICATION_COMPASS, {
    variables: {
      id: appId,
    },
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
    onCompleted: data => setApp({ ...app, ...data.application }),
  });

  const [app, setApp] = useState({ id: appId });

  const kymaQuery = useQuery(GET_APPLICATION, {
    variables: {
      name: app.name,
    },
    fetchPolicy: 'cache-and-network',
    skip: !app.name,
    onCompleted: data => setApp({ ...app, ...data.application }),
    onError: e =>
      notificationManager.notifyError({
        content: `Could not fatch partial Application data due to an error: ${e.message}`,
      }),
  });
  useEffect(() => {
    if (!kymaQuery.subscribeToMore || !app.name) return;
    kymaQuery.subscribeToMore({
      document: APPLICATIONS_EVENT_SUBSCRIPTION,
      variables: kymaQuery.variables,
      updateQuery: (prev, { subscriptionData }) => {
        const data = subscriptionData.data.applicationEvent;
        if (data.type === 'DELETE' && data.application.id === appId) {
          setApp({ id: appId });
          return;
        }
        setApp({
          ...app,
          ...data.application,
        });
      },
    });
  }, [kymaQuery, compassQuery, app, appId]);

  if (compassQuery.loading || kymaQuery.loading) return <Spinner />;

  if (compassQuery.error) {
    const breadcrumbItems = [{ name: 'Applications', path: '/' }, { name: '' }];
    return (
      <DetailsError
        breadcrumbs={breadcrumbItems}
        message={`Could not fetch Application data due to an error: ${compassQuery.error.message}`}
      ></DetailsError>
    );
  }

  if (!app || !app.name) {
    return <EntryNotFound entryType="Application" entryId={appId} />;
  }

  return (
    <article className="application-details">
      <ApplicationDetailsHeader app={app} />
      {kymaQuery.data && kymaQuery.data.application ? (
        <BoundNamespacesList
          data={app.enabledInNamespaces || []}
          appName={app.name}
          refetch={kymaQuery && kymaQuery.refetch}
        />
      ) : null}
    </article>
  );
};

const breadcrumbItems = [{ name: 'Applications', path: '/' }, { name: '' }];

function ApplicationDetailsHeader({ app }) {
  return (
    <PageHeader
      title={app.name || EMPTY_TEXT_PLACEHOLDER}
      breadcrumbItems={breadcrumbItems}
      actions={<ConnectApplicationModal applicationId={app.id} />}
    >
      <PageHeader.Column title="Status" columnSpan={null}>
        <ApplicationStatus application={app} />
      </PageHeader.Column>
      <PageHeader.Column title="Description" columnSpan={null}>
        {app.description || EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="Provider Name" columnSpan={null}>
        {app.providerName || EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="Labels" columnSpan={null}>
        <Labels labels={app.Labels} />
      </PageHeader.Column>
    </PageHeader>
  );
}

ApplicationDetails.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default ApplicationDetails;
