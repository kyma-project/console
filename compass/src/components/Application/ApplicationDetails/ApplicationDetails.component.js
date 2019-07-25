import React from 'react';
import PropTypes from 'prop-types';

import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import ScenarioDisplay from './ApplicationScenarioDisplay/ApplicationScenarioDisplay';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis.container';
import EventApisList from './ApplicationDetailsEventApis/ApplicationDetailsEventApis.container';
import ApplicationNotFoundMessage from './ApplicationNotFoundMessage/ApplicationNotFoundMessage';

ApplicationDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

function ApplicationDetails({
  applicationQuery,
  deleteApplicationMutation,
}) {
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

  let scenarios = [];
  if (application.labels && application.labels.scenarios) {
    scenarios = application.labels.scenarios.map(scenario => {
      return { scenario }; // list requires a list of objects
    });
  }

  return (
    <>
      <Header
        application={application}
        deleteApplication={deleteApplicationMutation}
      />
       <section className="fd-section">
        <ScenarioDisplay
          labels={scenarios}
          applicationId={application.id}
        />
        <ApisList
          apis={application.apis}
          applicationId={application.id}
        />
        <EventApisList
          eventApis={application.eventAPIs}
          applicationId={application.id}
        />
      </section>
    </>
  );
};

export default ApplicationDetails;
