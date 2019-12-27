import React from 'react';
import PropTypes from 'prop-types';

import './ApiDetails.scss';
import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';
import Panel from 'fundamental-react/Panel/Panel';
import { getApiType } from './../ApiHelpers';

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
    return <ResourceNotFound resource="API Definition" />;
  }

  return (
    <>
      <ApiDetailsHeader
        application={application}
        api={api}
        deleteMutation={apiId ? deleteAPIDefinition : deleteEventDefinition}
      ></ApiDetailsHeader>
      {api.spec ? (
        <DocumentationComponent
          type={getApiType(api)}
          content={api.spec.data}
        />
      ) : (
        <Panel className="fd-has-margin-large">
          <Panel.Body className="fd-has-text-align-center fd-has-type-4">
            No definition provided.
          </Panel.Body>
        </Panel>
      )}
    </>
  );
};

ApiDetails.propTypes = {
  apiId: PropTypes.string,
  eventApiId: PropTypes.string,
  applicationId: PropTypes.string.isRequired,
};

export default ApiDetails;
