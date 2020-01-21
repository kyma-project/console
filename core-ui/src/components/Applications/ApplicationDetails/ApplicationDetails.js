import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Button } from 'fundamental-react';

import { Spinner, PageHeader } from 'react-shared';
import { GET_APPLICATION } from '../../../gql/queries';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';
import Labels from 'shared/components/Labels/Labels';

const ApplicationDetails = ({ appName }) => {
  const { error, loading, data } = useQuery(GET_APPLICATION, {
    variables: {
      name: appName,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch Application data</h1>;
  }

  if (!data.application) {
    return <EntryNotFound entryType="Application" entryId={appName} />;
  }

  return (
    <>
      <ApplicationDetailsHeader data={data.application} />
    </>
  );
};

ApplicationDetails.propTypes = {
  appName: PropTypes.string.isRequired,
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
        {data.status}
      </PageHeader.Column>
      <PageHeader.Column title="Description" columnSpan={null}>
        {data.description}
      </PageHeader.Column>
      <PageHeader.Column title="Labels" columnSpan={null}>
        {Labels(data.labels)}
      </PageHeader.Column>
    </PageHeader>
  );
}
