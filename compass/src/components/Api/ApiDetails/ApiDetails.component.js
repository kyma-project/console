import React from 'react';

import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader'
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

function ApiDetails({ applicationQuery, apiId }) {

  //This is a temporary solution. Rewrite once 'api' query is ready.
  const application = (applicationQuery && applicationQuery.application) || {};
  const loading = applicationQuery.loading;
  const error = applicationQuery.error;
  if (!applicationQuery || !applicationQuery.application) {
    if (loading) return 'Loading...';
    if (error) {
    //fix resource not found component
      return (
        <ResourceNotFound resource="Application" breadcrumb="Applications" />
      );
    }
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  let api;
  if (application && application.apis && application.apis.data && application.apis.data.length) {
    const apis = application.apis.data;
    api = apis.find(a => (a.id === apiId));
    if (!api) {
      return (
        <ResourceNotFound resource="Api"/>
      );
    }
  }

  return (
    <>
      <ApiDetailsHeader application={application} api={api}></ApiDetailsHeader>
    </>
  );
}

export default ApiDetails;
