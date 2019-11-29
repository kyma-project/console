import React from 'react';
import PropTypes from 'prop-types';

import './ApiDetails.scss';
import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';

function getApiType(api) {
  switch (api.spec.type) {
    case 'OPEN_API':
      return 'openapi';
    case 'ODATA':
      return 'odata';
    case 'ASYNC_API':
      return 'asyncapi';
    default:
      return null;
  }
}

export const getApiDataFromQuery = (applicationQuery, apiId, eventApiId) => {
  const rawApisForApplication = apiId
    ? applicationQuery.apiDefinitions
    : applicationQuery.eventDefinitions;

  if (
    rawApisForApplication &&
    rawApisForApplication.data &&
    rawApisForApplication.data.length
  ) {
    const apisForApplication = rawApisForApplication.data;
    const idToLookFor = apiId || eventApiId;

    return apisForApplication.find(a => a.id === idToLookFor);
  } else {
    return null;
  }
};

const ApiDetails = ({
  getApiDefinitionsForApplication,
  getEventDefinitionsForApplication,
  deleteAPIDefinition,
  deleteEventDefinition,
  apiId,
  eventApiId,
  applicationId,
}) => {
  const query = apiId
    ? getApiDefinitionsForApplication
    : getEventDefinitionsForApplication;

  const { loading, error, application } = query;

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

  const api = getApiDataFromQuery(application, apiId, eventApiId);

  if (!api) {
    return <ResourceNotFound resource="Api" />;
  }

  const apiType = getApiType(api);
  return (
    <>
      <ApiDetailsHeader
        application={application}
        api={api}
        apiType={apiId ? 'OpenAPI' : 'AsyncAPI'}
        deleteMutation={apiId ? deleteAPIDefinition : deleteEventDefinition}
      ></ApiDetailsHeader>
      <DocumentationComponent type={apiType} content={api.spec.data} />
    </>
  );
};

ApiDetails.propTypes = {
  apiId: PropTypes.string,
  eventApiId: PropTypes.string,
  applicationId: PropTypes.string.isRequired,
};

export default ApiDetails;
