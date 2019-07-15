import React from 'react';
import PropTypes from 'prop-types';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import EventApisList from './ApplicationDetailsEventApis/ApplicationDetailsEventApis';
import ApplicationNotFoundMessage from './ApplicationNotFoundMessage/ApplicationNotFoundMessage';

ApplicationDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default function ApplicationDetails(props) {
  const application = props.application;
  const app = (application && application.application) || {};
  const loading = application.loading;
  const error = application.error;
  if (loading) return 'Loading...';
  if (error) {
    if (!application || !application.application) {
      return <ApplicationNotFoundMessage />;
    } else {
      return `Error! ${error.message}`;
    }
  }
  return (
    <>
      <Header application={app} deleteApplication={props.deleteApplication} />
      <section className="fd-section">
        <ApisList apis={app.apis} />
        <EventApisList eventApis={app.eventAPIs} />
      </section>
    </>
  );
}
