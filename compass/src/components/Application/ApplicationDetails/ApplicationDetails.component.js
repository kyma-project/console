import React from 'react';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import ScenariosList from './ApplicationDetailsScenarios/ApplicationDetailsScenarios.container';
import EventApisList from './ApplicationDetailsEventApis/ApplicationDetailsEventApis';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

const ApplicationDetails = ({
  applicationQuery,
  deleteApplicationMutation,
}) => {
  const application = (applicationQuery && applicationQuery.application) || {};
  const loading = applicationQuery.loading;
  const error = applicationQuery.error;
  if (!applicationQuery || !applicationQuery.application) {
    if (loading) return 'Loading...';
    if (error)
      return (
        <ResourceNotFound resource="Application" breadcrumb="Applications" />
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
    <>
      <Header
        application={application}
        deleteApplication={deleteApplicationMutation}
      />
      <section className="fd-section">
        <ScenariosList scenarios={scenarios} applicationId={application.id} />
        <ApisList apis={application.apis} applicationId={application.id} />
        <EventApisList
          eventApis={application.eventAPIs}
          applicationId={application.id}
        />
      </section>
    </>
  );
};

export default ApplicationDetails;
