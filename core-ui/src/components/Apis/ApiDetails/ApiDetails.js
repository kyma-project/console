import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'fundamental-react/Panel/Panel';
import { Button } from 'fundamental-react/Button';
import { GenericComponent } from '@kyma-project/generic-documentation';
import { useQuery } from 'react-apollo';
import LuigiClient from '@kyma-project/luigi-client';

import { PageHeader } from 'react-shared';
import { getApiType, getApiDisplayName } from '../ApiHelpers';
import {
  GET_APPLICATION_WITH_EVENT_DEFINITIONS,
  GET_APPLICATION_WITH_API_DEFINITIONS,
} from 'gql/queries';
import { CompassGqlContext } from 'index';

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
    { name: 'Application', path: `/details/${application}` },
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

  const query = queryApi ? queryApi : queryEventApi;

  const { loading, error, data } = query;

  if (!(data && data.application)) {
    if (loading) return 'Loading...';
    if (error) {
      return (
        // <ResourceNotFound resource="Application" breadcrumb="Applications" />
        <p>not found</p>
      );
    }
    return `Unable to find application with id ${appId}`;
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const api = getApiDataFromQuery(data.application, apiId, eventApiId);
  if (!api) {
    return <p>not found</p>;
    // <ResourceNotFound resource="API Definition" />;
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
        application={appId}
        api={api}
        actions={<EditButton />}
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
  appId: PropTypes.string.isRequired,
};

export default ApiDetails;
