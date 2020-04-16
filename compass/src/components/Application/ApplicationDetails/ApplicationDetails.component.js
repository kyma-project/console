import React from 'react';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import ScenariosList from './ApplicationDetailsScenarios/ApplicationDetailsScenarios';
import ApplicationApiPackages from './ApplicationApiPackages/ApplicationApiPackages';
import PropTypes from 'prop-types';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

ApplicationDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export const ApplicationQueryContext = React.createContext(null);

function ApplicationDetails({ applicationQuery, deleteApplicationMutation }) {
  const application = (applicationQuery && applicationQuery.application) || {};
  const loading = applicationQuery.loading;
  const error = applicationQuery.error;
  if (!applicationQuery || !applicationQuery.application) {
    if (loading) return 'Loading...';
    if (error)
      return (
        <ResourceNotFound
          resource="Application"
          breadcrumb="Applications"
          navigationPath="/"
          navigationContext="applications"
        />
      );
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const scenarios =
    application.labels && application.labels.scenarios
      ? application.labels.scenarios
      : [];

  return (
    <ApplicationQueryContext.Provider value={applicationQuery}>
      <Header
        application={application}
        deleteApplication={deleteApplicationMutation}
      />
      <ApplicationApiPackages
        apiPackages={application.packages.data}
        applicationId={application.id}
      />
      <ScenariosList scenarios={scenarios} applicationId={application.id} />
    </ApplicationQueryContext.Provider>
  );
}

export default ApplicationDetails;
