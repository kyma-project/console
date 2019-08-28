import React from 'react';

import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';

const ApiDetails = ({
  getApisForApplication,
  getEventApisForApplication,
  deleteApi,
  deleteEventApi,
  apiId,
  eventApiId,
  applicationId,
}) => {
  const query = apiId ? getApisForApplication : getEventApisForApplication;

  const loading = query.loading;
  const error = query.error;
  if (!query || !query.application) {
    if (loading) return 'Loading...';
    if (error) {
      //fix resource not found component
      return (
        <ResourceNotFound resource="Application" breadcrumb="Applications" />
      );
    }
    return `Unable to find application with id ${applicationId}`;
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  const application = (query && query.application) || {};

  let api;
  const rawApisForApplication = apiId
    ? application.apis
    : application.eventAPIs;

  if (
    rawApisForApplication &&
    rawApisForApplication.data &&
    rawApisForApplication.data.length
  ) {
    const apisForApplication = rawApisForApplication.data;
    const idToLookFor = apiId || eventApiId;
    api = apisForApplication.find(a => a.id === idToLookFor);
    if (!api) {
      return <ResourceNotFound resource="Api" />;
    }
  }
  console.log(apiId, api);
  return (
    <>
      <ApiDetailsHeader
        application={application}
        api={api}
        deleteApi={deleteApi}
      ></ApiDetailsHeader>
      <DocumentationComponent
        type={apiId ? 'openapi' : 'asyncapi'}
        content={api.spec.data}
      ></DocumentationComponent>
    </>
  );
};

export default ApiDetails;
