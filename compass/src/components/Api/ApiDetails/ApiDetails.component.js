import React from 'react';
import PropTypes from 'prop-types';

import './ApiDetails.scss';
import ApiDetailsHeader from './ApiDetailsHeader/ApiDetailsHeader';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import DocumentationComponent from '../../../shared/components/DocumentationComponent/DocumentationComponent';
import CustomPropTypes from 'react-shared';

import { Panel } from '@kyma-project/react-components';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/theme/github';

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

// temporary component, remove after GenericDocumentation for Open API is fixed.
const OpenAPIEditor = ({ api }) => {
  const editorMode = api.spec.format.toLowerCase();
  const spec = api.spec.data;
  return (
    <Panel className="fd-has-margin-s">
      <Panel.Body>
        <AceEditor
          style={{ border: '1px solid var(--fd-color-status-3)' }}
          className="fd-has-margin-m"
          mode={editorMode}
          theme="github"
          value={spec}
          width="95%"
          readOnly={true}
          minLines={14}
          maxLines={40}
          name="open-api-text-editor"
          editorProps={{ $blockScrolling: true }}
        />
      </Panel.Body>
    </Panel>
  );
};

export const getApiDataFromQuery = (applicationQuery, apiId, eventApiId) => {
  const rawApisForApplication = apiId
    ? applicationQuery.apis
    : applicationQuery.eventAPIs;

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
  getApisForApplication,
  getEventApisForApplication,
  deleteApi,
  deleteEventApi,
  apiId,
  eventApiId,
  applicationId,
}) => {
  const query = apiId ? getApisForApplication : getEventApisForApplication;

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
        deleteMutation={apiId ? deleteApi : deleteEventApi}
      ></ApiDetailsHeader>

      {apiType === 'openapi' ? (
        <OpenAPIEditor api={api} />
      ) : (
        <DocumentationComponent type={apiType} content={api.spec.data} />
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
