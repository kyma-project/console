import React from 'react';
import PropTypes from 'prop-types';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import './ApiPackageDetails.scss';
import ApisList from 'components/Application/ApplicationDetails/ApplicationDetailsApis/ApplicationDetailsApis.container';
import EventApisList from 'components/Application/ApplicationDetails/ApplicationDetailsEventApis/ApplicationDetailsEventApis.container';

import { useQuery } from '@apollo/react-hooks';
import { GET_API_PACKAGE } from './../gql';
import ApiPackageDetailsHeader from './Header/ApiPackageDetailsHeader';

ApiPackageDetails.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
};

export default function ApiPackageDetails({ applicationId, apiPackageId }) {
  const { data, error, loading } = useQuery(GET_API_PACKAGE, {
    variables: { applicationId, apiPackageId },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>`Error! ${error.message}`</p>;
  }

  const application = data.application;
  const apiPackage = application.package;

  if (!apiPackage) {
    return (
      <ResourceNotFound
        resource="API Package"
        breadcrumb="Application"
        navigationPath="/"
        navigationContext="application"
      />
    );
  }
  return (
    <>
      <ApiPackageDetailsHeader
        apiPackage={apiPackage}
        application={application}
      />
      <section className="api-package-items">
        <div>
          <ApisList
            apiDefinitions={apiPackage.apiDefinitions}
            packageId={apiPackage.id}
          />
          <EventApisList
            eventDefinitions={apiPackage.eventDefinitions}
            packageId={apiPackage.id}
          />
        </div>
      </section>
    </>
  );
}
