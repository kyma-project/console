import React from 'react';
import { useQuery } from 'react-apollo';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import ScenariosList from './ApplicationDetailsScenarios/ApplicationDetailsScenarios';
import ApplicationApiPackages from './ApplicationApiPackages/ApplicationApiPackages';
import PropTypes from 'prop-types';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import MetadataTable from 'components/Shared/MetadataTable/MetadataTable';

import { GET_APPLICATION } from '../gql';

import './ApplicationDetails.scss';

ApplicationDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export const ApplicationQueryContext = React.createContext(null);

function ApplicationDetails({ applicationId }) {
  const applicationQuery = useQuery(GET_APPLICATION, {
    variables: { id: applicationId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const {
    data: { application },
    loading,
    error,
  } = applicationQuery;

  if (loading) return 'Loading...';

  if (!application && !error) {
    return (
      <ResourceNotFound
        resource="Application"
        breadcrumb="Applications"
        navigationPath="/"
        navigationContext="applications"
      />
    );
  }
  if (error) return `Error! ${error.message}`;

  const labels = application.labels;
  const scenarios = labels && labels.scenarios ? labels.scenarios : [];

  return (
    <ApplicationQueryContext.Provider value={applicationQuery}>
      <Header application={application} />
      <ApplicationApiPackages
        apiPackages={application.packages.data}
        applicationId={application.id}
      />
      <section className="application-details-body">
        <ScenariosList scenarios={scenarios} applicationId={application.id} />
        <MetadataTable ownerType="Application" labels={labels} />
      </section>
    </ApplicationQueryContext.Provider>
  );
}

export default ApplicationDetails;
