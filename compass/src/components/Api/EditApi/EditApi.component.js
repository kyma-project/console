import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Panel, TabGroup, Tab, Toggle } from 'fundamental-react';
import EditApiHeader from './../EditApiHeader/EditApiHeader.container';
import ResourceNotFound from 'components/Shared/ResourceNotFound.component';
import ApiForm from '../Forms/ApiForm';
import TextDropdown from '../shared/TextDropdown/TextDropdown';
import CredentialsForm from './../Forms/CredentialForms/CredentialsForm';
import './EditApi.scss';

import { getRefsValues, useMutationObserver } from 'react-shared';
import {
  createApiData,
  inferCredentialType,
  verifyApiInput,
} from './../ApiHelpers';
import ApiEditorForm from '../Forms/ApiEditorForm';

EditApi.propTypes = {
  apiId: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired, // used in container file
  apiDataQuery: PropTypes.object.isRequired,
  updateApiDefinition: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function EditApi({
  apiId,
  apiDataQuery,
  updateApiDefinition,
  sendNotification,
}) {
  const formRef = React.useRef(null);
  const [formValid, setFormValid] = React.useState(true);
  const [specProvided, setSpecProvided] = React.useState();
  const [originalApi, setOriginalApi] = React.useState(null);
  const [format, setFormat] = React.useState('');
  const [apiType, setApiType] = React.useState('');
  const [specText, setSpecText] = React.useState('');

  const [credentialsType, setCredentialsType] = React.useState();

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

  React.useEffect(() => {
    if (apiDataQuery.application) {
      const originalApi = apiDataQuery.application.apiDefinitions.data.find(
        api => api.id === apiId,
      );

      setOriginalApi(originalApi);

      setCredentialsType(inferCredentialType(originalApi.defaultAuth));

      setSpecProvided(!!originalApi.spec);
      if (originalApi.spec) {
        setFormat(originalApi.spec.format);
        setSpecText(originalApi.spec.data);
        setApiType(originalApi.spec.type);
      } else {
        // default values
        setFormat('YAML');
        setApiType('OPEN_API');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiDataQuery.application]);

  const revalidateForm = () =>
    setFormValid(!!formRef.current && formRef.current.checkValidity());

  useMutationObserver(formRef, () => {
    console.log('halo');
    revalidateForm();
  });

  if (apiDataQuery.loading) {
    return <p>Loading...</p>;
  }
  if (apiDataQuery.error) {
    return <p>`Error! ${apiDataQuery.error.message}`</p>;
  }

  if (!originalApi) {
    return <ResourceNotFound resource="Rest API" breadcrumb="Applications" />;
  }

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
      await updateApiDefinition(apiId, apiData);

      const name = basicData.name;
      sendNotification({
        variables: {
          content: `Updated API "${name}".`,
          title: name,
          color: '#359c46',
          icon: 'accept',
          instanceName: name,
        },
      });
    } catch (e) {
      console.warn(e);
      LuigiClient.uxManager().showAlert({
        text: `Cannot update API: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
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
        applicationName={apiDataQuery.application.name}
        saveChanges={saveChanges}
        canSaveChanges={formValid}
      />
      <form ref={formRef} onChange={revalidateForm}>
        <TabGroup className="edit-api-tabs">
          <Tab
            key={'general-information'}
            id={'general-information'}
            title={'General Information'}
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
          <Tab key={'api'} id={'api'} title={'Rest API'}>
            <Panel className="spec-editor-panel">
              <Panel.Header>
                <p className="fd-has-type-1">Rest API</p>
                <Panel.Actions>
                  <TextDropdown
                    options={{ JSON: 'JSON', YAML: 'YAML', XML: 'XML' }}
                    selectedOption={format}
                    selectOption={setFormat}
                    disabled={!specProvided}
                  />
                  <TextDropdown
                    options={{ OPEN_API: 'Open API', ODATA: 'OData' }}
                    selectedOption={apiType}
                    selectOption={setApiType}
                    disabled={!specProvided}
                    className="fd-has-margin-left-m"
                  />
                  <Toggle
                    checked={specProvided}
                    onChange={() => setSpecProvided(!specProvided)}
                    className="fd-has-margin-left-m fd-display-l-inline-block"
                  >
                    <span className="fd-has-display-inline-block fd-has-margin-left-s">
                      Provide schema
                    </span>
                  </Toggle>
                </Panel.Actions>
              </Panel.Header>
              <Panel.Body>
                <ApiEditorForm
                  specText={specText}
                  setSpecText={updateSpecText}
                  specProvided={specProvided}
                  apiType={apiType}
                  format={format}
                  verifyApi={verifyApiInput}
                />
              </Panel.Body>
            </Panel>
          </Tab>
          <Tab key={'credentials'} id={'credentials'} title={'Credentials'}>
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
