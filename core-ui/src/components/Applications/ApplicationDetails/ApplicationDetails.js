import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { Spinner, PageHeader, DetailsError } from 'react-shared';
import { GET_APPLICATION, GET_APPLICATION_COMPASS } from '../../../gql/queries';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';
import Labels from 'shared/components/Labels/Labels';
import BoundNamespacesList from '../BoundNamespacesList/BoundNamespacesList';
import { CompassGqlContext } from 'index';
import { EMPTY_TEXT_PLACEHOLDER } from 'shared/constants';

const ApplicationDetails = ({ appId }) => {
  const compassGqlClient = useContext(CompassGqlContext);

  const compassQuery = useQuery(GET_APPLICATION_COMPASS, {
    variables: {
      id: appId,
    },
    fetchPolicy: 'no-cache',
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
    fetchPolicy: 'no-cache',
    skip: !appName,
  });

  if (compassQuery.loading || kymaQuery.loading) {
    return <Spinner />;
  }

  if (compassQuery.error) {
    // return <p> {compassQuery.error.message}</p>
    const breadcrumbItems = [{ name: 'Applications', path: '' }, { name: '' }];
    return (
      <DetailsError
        breadcrumbs={breadcrumbItems}
        message={`Couldn't fetch Application data due to an error: ${compassQuery.error.message}`}
      ></DetailsError>
    );
  }

  if (!compassQuery.data || !compassQuery.data.application) {
    return <EntryNotFound entryType="Application" entryId={appId} />;
  }

  return (
    <>
      <ApplicationDetailsHeader
        data={
          kymaQuery.data && kymaQuery.data.application
            ? kymaQuery.data.application
            : compassQuery.data.application
        }
      />
      {kymaQuery.data && kymaQuery.data.application ? (
        <BoundNamespacesList
          data={kymaQuery.data.application.enabledInNamespaces}
        />
      ) : (
        ''
      )}
    </>
  );
};

ApplicationDetails.propTypes = {
  appId: PropTypes.string.isRequired,
};

export default ApplicationDetails;

const breadcrumbItems = [{ name: 'Applications', path: '/' }, { name: '' }];

function ApplicationDetailsHeader({ data }) {
  return (
    <PageHeader title={data.name} breadcrumbItems={breadcrumbItems}>
      <PageHeader.Column title="Name" columnSpan={null}>
        {data.name}
      </PageHeader.Column>
      <PageHeader.Column title="Status" columnSpan={null}>
        {data.status || EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="Description" columnSpan={null}>
        {data.description || EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="Labels" columnSpan={null}>
        {Labels(data.labels)}
      </PageHeader.Column>
    </PageHeader>
  );
}
