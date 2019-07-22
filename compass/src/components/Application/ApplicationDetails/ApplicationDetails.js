import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { GET_APPLICATION } from './../gql';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import EventApisList from './ApplicationDetailsEventApis/ApplicationDetailsEventApis';
import ApplicationNotFoundMessage from './ApplicationNotFoundMessage/ApplicationNotFoundMessage';

ApplicationDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default function ApplicationDetails(props) {
  return (
    <Query query={GET_APPLICATION} variables={{ id: props.applicationId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) {
          console.warn(error);
          if (!data || !data.application) {
            return <ApplicationNotFoundMessage />;
          } else {
            return `Error! ${error.message}`;
          }
        }

        const application = data.application;

        return (
          <>
            <Header application={application} />
            <section className="fd-section">
              <ApisList apis={application.apis} applicationId={application.id} />
              <EventApisList eventApis={application.eventAPIs} applicationId={application.id} />
            </section>
          </>
        );
      }}
    </Query>
  );
}
