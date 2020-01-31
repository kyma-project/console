import React from 'react';
import PropTypes from 'prop-types';

import { Panel, TabGroup, Tab, Button } from 'fundamental-react';
import EditApiHeader from '../EditApiHeader/EditApiHeader';
import ApiForm from '../Forms/ApiForm';
import CredentialsForm from '../Forms/CredentialForms/CredentialsForm';
import './EditApi.scss';

import { GET_APPLICATION_WITH_API_DEFINITIONS } from 'gql/queries';
import { UPDATE_API_DEFINITION } from 'gql/mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';

import {
  getRefsValues,
  useMutationObserver,
  Dropdown,
  useNotification,
  ResourceNotFound,
} from 'react-shared';
import {
  createApiData,
  inferCredentialType,
  verifyApiInput,
} from '../ApiHelpers';
import ApiEditorForm from '../Forms/ApiEditorForm';

EditApi.propTypes = {
  apiId: PropTypes.string.isRequired,
  originalApi: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

function EditApi({ apiId, originalApi, application }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const notificationManager = useNotification();

  const [updateApiDefinition] = useMutation(UPDATE_API_DEFINITION, {
    client: compassGqlClient,
  });

  const formRef = React.useRef(null);
  const [formValid, setFormValid] = React.useState(true);
  const [specProvided, setSpecProvided] = React.useState(!!originalApi.spec);
  const [format, setFormat] = React.useState(
    originalApi.spec ? originalApi.spec.format : 'YAML',
  );
  const [apiType, setApiType] = React.useState(
    originalApi.spec ? originalApi.spec.type : 'OPEN_API',
  );
  const [specText, setSpecText] = React.useState(
    originalApi.spec ? originalApi.spec.data : '',
  );

  const [credentialsType, setCredentialsType] = React.useState(
    inferCredentialType(originalApi.defaultAuth),
  );

  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
    group: React.useRef(null),
    targetURL: React.useRef(null),
  };

  const credentialRefs = {
    oAuth: {
      clientId: React.useRef(null),
      clientSecret: React.useRef(null),
      url: React.useRef(null),
    },
  };

  const revalidateForm = () =>
    setFormValid(!!formRef.current && formRef.current.checkValidity());

  useMutationObserver(formRef, revalidateForm);

  const saveChanges = async () => {
    const basicData = getRefsValues(formValues);
    const specData = specProvided
      ? { data: specText, format, type: apiType }
      : null;
    const credentialsData = { oAuth: getRefsValues(credentialRefs.oAuth) };
    const apiData = createApiData(
      basicData,
      specData,
      credentialsData,
      credentialsType,
    );

    try {
      await updateApiDefinition({
        variables: {
          id: apiId,
          in: apiData,
        },
      });
      notificationManager.notifySuccess({
        content: `Updated API "${basicData.name}".`,
      });
    } catch (e) {
      console.warn(e);
      notificationManager.notifyError({
        content: `Cannot update API: ${e.message}`,
      });
    }
  };

  const updateSpecText = text => {
    setSpecText(text);
    revalidateForm();
  };

  const defaultCredentials = originalApi.defaultAuth
    ? { oAuth: { ...originalApi.defaultAuth.credential } }
    : null;

  return (
    <>
      <EditApiHeader
        api={originalApi}
        application={application}
        saveChanges={saveChanges}
        canSaveChanges={formValid}
      />
      <form ref={formRef} onChange={revalidateForm}>
        <TabGroup className="edit-api-tabs">
          <Tab
            key="general-information"
            id="general-information"
            title="General Information"
          >
            <Panel>
              <Panel.Header>
                <p className="fd-has-type-1">General Information</p>
              </Panel.Header>
              <Panel.Body>
                <ApiForm
                  formValues={formValues}
                  defaultValues={{ ...originalApi }}
                />
              </Panel.Body>
            </Panel>
          </Tab>
          <Tab
            key="api-documentation"
            id="api-documentation"
            title="API Documentation"
          >
            <Panel className="spec-editor-panel">
              <Panel.Header>
                <p className="fd-has-type-1">API Documentation</p>
                <Panel.Actions>
                  {specProvided && (
                    <>
                      <Dropdown
                        options={{ JSON: 'JSON', YAML: 'YAML', XML: 'XML' }}
                        selectedOption={format}
                        onSelect={setFormat}
                        width="90px"
                      />
                      <Dropdown
                        options={{ OPEN_API: 'Open API', ODATA: 'OData' }}
                        selectedOption={apiType}
                        onSelect={setApiType}
                        className="fd-has-margin-x-small"
                        width="120px"
                      />
                      <Button
                        type="negative"
                        onClick={() => setSpecProvided(false)}
                      >
                        No documentation
                      </Button>
                    </>
                  )}
                  {!specProvided && (
                    <Button onClick={() => setSpecProvided(true)}>
                      Provide documentation
                    </Button>
                  )}
                </Panel.Actions>
              </Panel.Header>
              <Panel.Body>
                {specProvided && (
                  <ApiEditorForm
                    specText={specText}
                    setSpecText={updateSpecText}
                    specProvided={specProvided}
                    apiType={apiType}
                    format={format}
                    verifyApi={verifyApiInput}
                    revalidateForm={revalidateForm}
                  />
                )}
              </Panel.Body>
            </Panel>
          </Tab>
          <Tab key="credentials" id="credentials" title="Credentials">
            <Panel>
              <Panel.Header>
                <p className="fd-has-type-1">Credentials</p>
              </Panel.Header>
              <Panel.Body>
                <CredentialsForm
                  credentialRefs={credentialRefs}
                  credentialType={credentialsType}
                  setCredentialType={type => {
                    setCredentialsType(type);
                    setTimeout(() => {
                      revalidateForm();
                    });
                  }}
                  defaultValues={defaultCredentials}
                />
              </Panel.Body>
            </Panel>
          </Tab>
        </TabGroup>
      </form>
    </>
  );
}

EditApiWrapper.propTypes = {
  apiId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
};

export default function EditApiWrapper({ apiId, appId }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const { loading, data, error } = useQuery(
    GET_APPLICATION_WITH_API_DEFINITIONS,
    {
      client: compassGqlClient,
      fetchPolicy: 'cache-and-network',
      variables: {
        applicationId: appId,
      },
    },
  );

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error! ${error.message}</p>;
  }

  // there's no getApiById query
  const originalApi = data.application.apiDefinitions.data.find(
    api => api.id === apiId,
  );

  if (!originalApi) {
    return (
      <ResourceNotFound
        resource="Event Definition"
        breadcrumb="Applications"
        path={`details/${appId}`}
      />
    );
  }

  return (
    <EditApi
      apiId={apiId}
      originalApi={originalApi}
      application={data.application}
    />
  );
}
