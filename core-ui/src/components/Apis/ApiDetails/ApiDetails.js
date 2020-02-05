import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'fundamental-react/Panel/Panel';
import { Button } from 'fundamental-react/Button';
import { GenericComponent } from '@kyma-project/generic-documentation';
import { useQuery } from 'react-apollo';
import LuigiClient from '@kyma-project/luigi-client';

import { PageHeader, ResourceNotFound } from 'react-shared';
import { getApiType, getApiDisplayName } from '../ApiHelpers';
import {
  GET_APPLICATION_WITH_EVENT_DEFINITIONS,
  GET_APPLICATION_WITH_API_DEFINITIONS,
} from 'gql/queries';
import { CompassGqlContext } from 'index';
import './ApiDetails.scss';

export const getApiDataFromQuery = (applicationQuery, apiId, eventApiId) => {
  if (!applicationQuery) return;
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

const DocumentationComponent = ({ content, type }) => (
  <GenericComponent
    layout="compass-ui"
    sources={[
      {
        source: {
          rawContent: content,
          type,
        },
      },
    ]}
  />
);

const ApiDetailsHeader = ({ api, application, actions }) => {
  const breadcrumbItems = [
    { name: 'Applications', path: '/' },
    { name: application.name, path: `/details/${application.id}` },
    { name: '' },
  ];
  return (
    <PageHeader
      breadcrumbItems={breadcrumbItems}
      title={api.name}
      actions={actions}
    >
      <PageHeader.Column title="Type">
        {getApiDisplayName(api) || <em>Not provided</em>}
      </PageHeader.Column>
    </PageHeader>
  );
};

const ApiDetails = ({ apiId, eventApiId, appId }) => {
  const compassGqlClient = React.useContext(CompassGqlContext);

  const queryApi = useQuery(GET_APPLICATION_WITH_API_DEFINITIONS, {
    variables: {
      applicationId: appId,
    },
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
    skip: !apiId,
  });
  const queryEventApi = useQuery(GET_APPLICATION_WITH_EVENT_DEFINITIONS, {
    variables: {
      applicationId: appId,
    },
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
    skip: !eventApiId,
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
    return `Unable to find application with id ${appId}`;
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const api = getApiDataFromQuery(data.application, apiId, eventApiId);
  if (!api) {
    const resourceType = apiId ? 'API Definition' : 'Event Definition';
    return (
      <ResourceNotFound
        resource={resourceType}
        breadcrumb={data.application.name}
        path={`/details/${appId}`}
      />
    );
  }

  function EditButton() {
    return (
      <Button
        onClick={() => LuigiClient.linkManager().navigate(`edit`)}
        option="light"
        aria-label="edit-api-rule"
      >
        Edit
      </Button>
    );
  }

  return (
    <>
      <ApiDetailsHeader
        application={data.application}
        api={api}
        actions={<EditButton />}
      />
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
  appId: PropTypes.string.isRequired,
};

export default ApiDetails;
