import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header/ApiPackageDetailsHeader';
import ApiList from './ApiList/ApiList';
import EventList from './EventList/EventList';
import AuthList from './AuthList/AuthList';

import { ResourceNotFound } from 'react-shared';

import { useQuery } from '@apollo/react-hooks';
import { GET_API_PACKAGE } from 'gql/queries';
import { CompassGqlContext } from 'index';

ApiPackageDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
};

export default function ApiPackageDetails({ applicationId, apiPackageId }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const { data, error, loading } = useQuery(GET_API_PACKAGE, {
    client: compassGqlClient,
    variables: { applicationId, apiPackageId },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error! ${error.message}`}</p>;

  const application = data.application;
  if (!application) {
    return (
      <ResourceNotFound
        resource="Application"
        breadcrumb="Applications"
        path="/"
      />
    );
  }

  const apiPackage = application.package;
  if (!apiPackage) {
    return (
      <ResourceNotFound resource="Package" breadcrumb="Application" path="/" />
    );
  }

  return (
    <>
      <Header apiPackage={apiPackage} application={application} />
      <AuthList auths={apiPackage.instanceAuths} />
      <ApiList
        apiDefinitions={apiPackage.apiDefinitions.data}
        applicationId={application.id}
        apiPackageId={apiPackage.id}
      />
      <EventList
        eventDefinitions={apiPackage.eventDefinitions.data}
        applicationId={application.id}
        apiPackageId={apiPackage.id}
      />
    </>
  );
}
