import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { TabGroup, Tab } from 'fundamental-react';

import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import Header from './Header/ApiPackageDetailsHeader';
import ApiList from './ApiList/ApiList';
import EventList from './EventList/EventList';
import AuthList from './AuthList/AuthList';
import { GET_API_PACKAGE } from './../gql';

ApiPackageDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
};

export default function ApiPackageDetails({ applicationId, apiPackageId }) {
  const { data, error, loading } = useQuery(GET_API_PACKAGE, {
    variables: { applicationId, apiPackageId },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  const application = data.application;
  if (!application)
    return (
      <ResourceNotFound
        resource="Application"
        breadcrumb="Applications"
        navigationPath="/"
        navigationContext="applications"
      />
    );

  const apiPackage = application.package;

  if (!apiPackage) {
    return (
      <ResourceNotFound
        resource="Package"
        breadcrumb="Application"
        navigationPath="/"
        navigationContext="application"
      />
    );
  }
  return (
    <>
      <Header apiPackage={apiPackage} application={application} />
      <TabGroup>
        <Tab key="api-list" id="api-list" title="API Package Content">
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
        </Tab>
        <Tab key="auth-data" id="auth-data" title="Auth data">
          <AuthList auths={apiPackage.instanceAuths} />
        </Tab>
      </TabGroup>
    </>
  );
}
