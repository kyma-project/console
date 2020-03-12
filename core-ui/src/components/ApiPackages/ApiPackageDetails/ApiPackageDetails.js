import React from 'react';
import PropTypes from 'prop-types';
// import ResourceNotFound from '../../Shared/ResourceNotFound.component';
// import Header from './Header/ApiPackageDetailsHeader';
// import ApiList from './ApiList/ApiList';
// import EventList from './EventList/EventList';
// import AuthList from './AuthList/AuthList';

import { useQuery } from '@apollo/react-hooks';
import { GET_API_PACKAGE } from './../gql';
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
  if (error) return <p>`Error! ${error.message}`</p>;

  const application = data.application;
  const apiPackage = application.package;

  // if (!apiPackage) {
  //   return (
  //     <ResourceNotFound
  //       resource="Package"
  //       breadcrumb="Application"
  //       navigationPath="/"
  //       navigationContext="application"
  //     />
  //   );
  // }
  return (
    <>
      {/* <Header apiPackage={apiPackage} application={application} /> */}
      {/* <AuthList auths={apiPackage.instanceAuths} />
      <ApiList
        apiDefinitions={apiPackage.apiDefinitions.data}
        applicationId={application.id}
        apiPackageId={apiPackage.id}
      />
      <EventList
        eventDefinitions={apiPackage.eventDefinitions.data}
        applicationId={application.id}
        apiPackageId={apiPackage.id}
      /> */}
    </>
  );
}
