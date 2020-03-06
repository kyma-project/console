import React from 'react';
import PropTypes from 'prop-types';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import './ApiPackageDetails.scss';
import Header from './Header/ApiPackageDetailsHeader';
import ApiList from './../ApiList/ApiList';
import EventList from '../EventList/EventList';

import { useQuery } from '@apollo/react-hooks';
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
      <Header apiPackage={apiPackage} application={application} />
      <section className="api-package-items">
        <div>
          <ApiList
            apiDefinitions={apiPackage.apiDefinitions}
            applicationId={application.id}
            apiPackageId={apiPackage.id}
          />
          <EventList
            eventDefinitions={apiPackage.eventDefinitions}
            applicationId={application.id}
            apiPackageId={apiPackage.id}
          />
        </div>
      </section>
    </>
  );
}
