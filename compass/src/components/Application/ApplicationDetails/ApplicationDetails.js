import React from 'react';
import { Query } from 'react-apollo';
import { GET_APPLICATION } from './../gql';
import ApisList from './ApplicationDetailsApis/ApplicationDetailsApis';
import Header from './ApplicationDetailsHeader/ApplicationDetailsHeader';
import EventApisList from './ApplicationDetailsEventApis/ApplicationDetailsEventApis';

export default function ApplicationDetails(props) {
  return (
    <Query query={GET_APPLICATION} variables={{ id: props.applicationId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const application = data.application;

        return (
          <>
            <Header application={application} />
            <section className="fd-section">
              <ApisList apis={application.apis} />
              <EventApisList eventApis={application.eventAPIs} />
            </section>
          </>
        );
      }}
    </Query>
  );
};
