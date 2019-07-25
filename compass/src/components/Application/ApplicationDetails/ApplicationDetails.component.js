import React from 'react';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
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
  return (
    <>
      <Header
        application={application}
        deleteApplication={deleteApplicationMutation}
      />
      <section className="fd-section">
        <ApisList apis={application.apis} />
        <EventApisList eventApis={application.eventAPIs} />
      </section>
    </>
  );
};

export default ApplicationDetails;
