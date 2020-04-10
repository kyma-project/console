import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'fundamental-react/Panel/Panel';
import { useQuery } from 'react-apollo';

import { useMutation } from '@apollo/react-hooks';

import { ResourceNotFound } from 'react-shared';
import { getApiType } from '../ApiHelpers';

import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';
import {
  GET_API_DEFININTION,
  DELETE_API_DEFINITION,
  DELETE_EVENT_DEFINITION,
  GET_EVENT_DEFINITION,
} from './../gql';
import './ApiDetails.scss';
import { convert } from 'asyncapi-converter';

const ApiDetails = ({ apiId, eventApiId, applicationId, apiPackageId }) => {
  const queryApi = useQuery(GET_API_DEFININTION, {
    variables: {
      applicationId: applicationId,
      apiPackageId,
      apiDefinitionId: apiId,
    },
    fetchPolicy: 'cache-and-network',
    skip: !apiId,
  });
  const queryEventApi = useQuery(GET_EVENT_DEFINITION, {
    variables: {
      applicationId: applicationId,
      apiPackageId,
      eventDefinitionId: eventApiId,
    },
    fetchPolicy: 'cache-and-network',
    skip: !eventApiId,
  });
  const [deleteAPIDefinition] = useMutation(DELETE_API_DEFINITION, {
    refetchQueries: () => [
      {
        query: GET_API_DEFININTION,
        variables: {
          applicationId: applicationId,
          apiPackageId,
          apiDefinitionId: apiId,
        },
      },
    ],
  });
  const [deleteEventDefinition] = useMutation(DELETE_EVENT_DEFINITION, {
    refetchQueries: () => [
      {
        query: GET_EVENT_DEFINITION,
        variables: {
          applicationId: applicationId,
          apiPackageId,
          eventDefinitionId: eventApiId,
        },
      },
    ],
  });

  const query = apiId ? queryApi : queryEventApi;

  const { loading, error, data } = query;

  if (loading) return 'Loading...';

  if (!(data && data.application)) {
    if (error) {
      return (
        <ResourceNotFound
          resource="Application"
          breadcrumb="Applications"
          path={'/'}
        />
      );
    }
    return `Unable to find application with id ${applicationId}`;
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const api =
    data.application.package[apiId ? 'apiDefinition' : 'eventDefinition'];

  if (!api) {
    const resourceType = apiId ? 'API Definition' : 'Event Definition';
    return (
      <ResourceNotFound
        resource={resourceType}
        breadcrumb="Application"
        navigationPath="/"
        navigationContext="application"
      />
    );
  }

  let specToShow = api.spec ? api.spec.data : undefined;

  if (eventApiId && specToShow) {
    try {
      const parsedSpec = JSON.parse(specToShow);
      if (parsedSpec.asyncapi && parsedSpec.asyncapi.startsWith('1.')) {
        specToShow = convert(specToShow, '2.0.0');
      }
    } catch (e) {
      console.error('Error parsing async api spec', e);
    }
  }

  return (
    <>
      <ApiDetailsHeader
        application={data.application}
        apiPackage={data.application.package}
        api={api}
        deleteMutation={apiId ? deleteAPIDefinition : deleteEventDefinition}
      />
      {api.spec ? (
        <DocumentationComponent type={getApiType(api)} content={specToShow} />
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
  apiPackageId: PropTypes.string.isRequired,
};

export default ApiDetails;
