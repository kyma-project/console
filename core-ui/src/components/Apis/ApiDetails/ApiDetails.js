import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'fundamental-react/Panel/Panel';
import { Button } from 'fundamental-react/Button';
import { GenericComponent } from '@kyma-project/generic-documentation';
import { useQuery } from 'react-apollo';
import LuigiClient from '@kyma-project/luigi-client';

import { PageHeader, ResourceNotFound } from 'react-shared';
import { getApiType, getApiDisplayName } from '../ApiHelpers';
import { GET_API_DEFININTION, GET_EVENT_DEFINITION } from 'gql/queries';
import { CompassGqlContext } from 'index';
import './ApiDetails.scss';
import { convert } from 'asyncapi-converter';

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

const ApiDetailsHeader = ({ api, apiPackage, application, actions }) => {
  const breadcrumbItems = [
    { name: 'Applications', path: '/' },
    { name: application.name, path: `/details/${application.id}` },
    {
      name: apiPackage.name,
      path: `/details/${application.id}/apiPackage/${apiPackage.id}`,
    },
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

const ApiDetails = ({ apiId, eventApiId, appId, apiPackageId }) => {
  const compassGqlClient = React.useContext(CompassGqlContext);

  const queryApi = useQuery(GET_API_DEFININTION, {
    variables: {
      applicationId: appId,
      apiPackageId,
      apiDefinitionId: apiId,
    },
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
    skip: !apiId,
  });
  const queryEventApi = useQuery(GET_EVENT_DEFINITION, {
    variables: {
      applicationId: appId,
      apiPackageId,
      eventDefinitionId: eventApiId,
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

  const api =
    data.application.package[apiId ? 'apiDefinition' : 'eventDefinition'];

  let specToShow = api.spec.data;

  if (eventApiId) {
    try {
      const parsedSpec = JSON.parse(specToShow);
      if (parsedSpec.asyncapi && parsedSpec.asyncapi.startsWith('1.')) {
        specToShow = convert(specToShow, '2.0.0');
      }
    } catch (e) {
      console.error('Error parsing async api spec', e);
    }
  }

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
        apiPackage={data.application.package}
        api={api}
        actions={<EditButton />}
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
  appId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
};

export default ApiDetails;
