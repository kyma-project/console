import React from 'react';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
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
    if (error) return <ResourceNotFound resource="Application" breadcrumb="Applications"/>;
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
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
