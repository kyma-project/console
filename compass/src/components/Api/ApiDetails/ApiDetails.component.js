import React from 'react';
import PropTypes from 'prop-types';

import './ApiDetails.scss';
import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';
import InProgressMessage from '../../../shared/components/InProgressMessage/InProgressMessage.component';
import { CustomPropTypes } from '../../../shared/typechecking/CustomPropTypes';

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

  const { loading, error } = query;
  const application = query && query.application;

  if (!application) {
    if (loading) return 'Loading...';
    if (error) {
      return (
        <ResourceNotFound resource="Application" breadcrumb="Applications" />
      );
    }
    return `Unable to find application with id ${applicationId}`;
  }
  if (error) {
    return `Error! ${error.message}`;
  }

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
  } else {
    return <ResourceNotFound resource="Api" />;
  }

  return (
    <>
      <ApiDetailsHeader
        application={application}
        api={api}
        apiType={apiId ? 'OpenAPI' : 'AsyncAPI'}
        deleteMutation={apiId ? deleteApi : deleteEventApi}
      ></ApiDetailsHeader>

      {apiId ? (
        <InProgressMessage />
      ) : (
        <DocumentationComponent
          type={apiId ? 'openapi' : 'asyncapi'}
          content={api.spec.data}
        ></DocumentationComponent>
      )}
    </>
  );
};

ApiDetails.propTypes = {
  apiId: (props, propName, componentName) =>
    CustomPropTypes.oneOfProps(props, componentName, ['apiId', 'eventApiId']),

  eventApiId: (props, propName, componentName) =>
    CustomPropTypes.oneOfProps(props, componentName, ['apiId', 'eventApiId']),
  applicationId: PropTypes.string.isRequired,
};

export default ApiDetails;
