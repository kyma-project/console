import React from 'react';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import ScenarioDisplay from './ApplicationScenarioDisplay/ApplicationScenarioDisplay.container';
import EventApisList from './ApplicationDetailsEventApis/ApplicationDetailsEventApis';
import ApplicationNotFoundMessage from './ApplicationNotFoundMessage/ApplicationNotFoundMessage';

const ApplicationDetails = ({
  applicationQuery,
  deleteApplicationMutation,
}) => {
  const application = (applicationQuery && applicationQuery.application) || {};
  const loading = applicationQuery.loading;
  const error = applicationQuery.error;
  if (loading) return 'Loading...';
  if (error) {
    if (!applicationQuery || !applicationQuery.application) {
      return <ApplicationNotFoundMessage />;
    } else {
      return `Error! ${error.message}`;
    }
  }

  const scenarios = application.labels
    ? application.labels.scenarios
    : [] || [];

  return (
    <>
      <Header
        application={application}
        deleteApplication={deleteApplicationMutation}
      />
      <section className="fd-section">
        <ScenarioDisplay scenarios={scenarios} applicationId={application.id} />
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
