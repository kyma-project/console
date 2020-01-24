import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import {
  Spinner,
  PageHeader,
  DetailsError,
  useNotification,
} from 'react-shared';
import { GET_APPLICATION, GET_APPLICATION_COMPASS } from '../../../gql/queries';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';
import Labels from 'shared/components/Labels/Labels';
import BoundNamespacesList from '../BoundNamespacesList/BoundNamespacesList';
import { CompassGqlContext } from 'index';
import { EMPTY_TEXT_PLACEHOLDER } from 'shared/constants';
import { InlineHelp } from 'fundamental-react';

const ApplicationDetails = ({ appId }) => {
  const notificationManager = useNotification();
  const compassGqlClient = useContext(CompassGqlContext);

  const compassQuery = useQuery(GET_APPLICATION_COMPASS, {
    variables: {
      id: appId,
    },
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
  });

  const appName =
    compassQuery.data &&
    compassQuery.data.application &&
    compassQuery.data.application.name;
  const kymaQuery = useQuery(GET_APPLICATION, {
    variables: {
      name: appName,
    },
    fetchPolicy: 'cache-and-network',
    skip: !appName,
  });

  useEffect(() => {
    if (kymaQuery.error) {
      notificationManager.notify({
        content: `Could not fatch partial Application data due to an error: ${kymaQuery.error.message}`,
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
        autoClose: false,
      });
    }
  }, [kymaQuery, notificationManager]);

  if (compassQuery.loading || kymaQuery.loading) {
    return <Spinner />;
  }

  if (compassQuery.error) {
    const breadcrumbItems = [{ name: 'Applications', path: '' }, { name: '' }];
    return (
      <DetailsError
        breadcrumbs={breadcrumbItems}
        message={`Could not fetch Application data due to an error: ${compassQuery.error.message}`}
      ></DetailsError>
    );
  }

  if (!compassQuery.data || !compassQuery.data.application) {
    return <EntryNotFound entryType="Application" entryId={appId} />;
  }

  return (
    <>
      <ApplicationDetailsHeader
        kymaData={kymaQuery.data && kymaQuery.data.application}
        compassData={compassQuery.data && compassQuery.data.application}
      />
      {kymaQuery.data && kymaQuery.data.application ? (
        <BoundNamespacesList
          data={kymaQuery.data.application.enabledInNamespaces}
          appName={kymaQuery.data.application.name}
          refetch={kymaQuery && kymaQuery.refetch}
        />
      ) : (
        ''
      )}
    </>
  );
};

const breadcrumbItems = [{ name: 'Applications', path: '/' }, { name: '' }];

function ApplicationDetailsHeader({ kymaData, compassData }) {
  return (
    <PageHeader title={compassData.name} breadcrumbItems={breadcrumbItems}>
      <PageHeader.Column title="Name" columnSpan={null}>
        {compassData.name}
      </PageHeader.Column>
      <PageHeader.Column title="Status" columnSpan={null}>
        {Status(kymaData)}
      </PageHeader.Column>
      <PageHeader.Column title="Description" columnSpan={null}>
        {(kymaData && kymaData.description) || EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="Provider Name" columnSpan={null}>
        {compassData.providerName || EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="Labels" columnSpan={null}>
        {Labels(kymaData && kymaData.labels)}
      </PageHeader.Column>
    </PageHeader>
  );
}

function Status(application) {
  const status =
    application === null
      ? 'NOT_INSTALLED'
      : (application && application.status) || EMPTY_TEXT_PLACEHOLDER;
  switch (status) {
    case 'NOT_INSTALLED':
      return (
        <p>
          {status}{' '}
          <InlineHelp text="This application is not active for your Tenant. You can edit it, but you can't bind it to a Namespace." />
        </p>
      );
    default:
      return <p>{status}</p>;
  }
}

ApplicationDetails.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default ApplicationDetails;
