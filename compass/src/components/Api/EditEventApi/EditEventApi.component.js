import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { Panel, TabGroup, Tab, Button } from 'fundamental-react';
import EditApiHeader from './../EditApiHeader/EditApiHeader.container';
import ResourceNotFound from 'components/Shared/ResourceNotFound.component';
import ApiEditorForm from '../Forms/ApiEditorForm';
import EventApiForm from '../Forms/EventApiForm';
import { Dropdown } from 'components/Shared/Dropdown/Dropdown';
import './EditEventApi.scss';

import { getRefsValues } from 'react-shared';
import { createEventAPIData, verifyEventApiInput } from './../ApiHelpers';

const commonPropTypes = {
  eventApiId: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired, // used in container file
  updateEventDefinition: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

EditEventApi.propTypes = {
  originalEventApi: PropTypes.object.isRequired,
  applicationName: PropTypes.string.isRequired,
  ...commonPropTypes,
};

function EditEventApi({
  originalEventApi,
  applicationName,
  eventApiId,
  updateEventDefinition,
  sendNotification,
}) {
  const formRef = React.useRef(null);
  const [formValid, setFormValid] = React.useState(true);
  const [specProvided, setSpecProvided] = React.useState(
    !!originalEventApi.spec,
  );
  const [format, setFormat] = React.useState(
    originalEventApi.spec ? originalEventApi.spec.format : 'YAML',
  );
  const [specText, setSpecText] = React.useState(
    originalEventApi.spec ? originalEventApi.spec.data : '',
  );

  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
    group: React.useRef(null),
  };

  const revalidateForm = () =>
    setFormValid(!!formRef.current && formRef.current.checkValidity());

  const saveChanges = async () => {
    const basicData = getRefsValues(formValues);
    const specData = specProvided ? { data: specText, format } : null;
    const eventApiData = createEventAPIData(basicData, specData);
    try {
      await updateEventDefinition(eventApiId, eventApiData);

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

  return (
    <>
      <EditApiHeader
        api={originalEventApi}
        applicationName={applicationName}
        saveChanges={saveChanges}
        canSaveChanges={formValid}
      />
      <form ref={formRef} onChange={revalidateForm}>
        <TabGroup className="edit-event-api-tabs">
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
                <EventApiForm
                  formValues={formValues}
                  defaultValues={{ ...originalEventApi }}
                />
              </Panel.Body>
            </Panel>
          </Tab>
          <Tab
            key="event-documentation"
            id="event-documentation"
            title="Event Documentation"
          >
            <Panel className="spec-editor-panel">
              <Panel.Header>
                <p className="fd-has-type-1">Event Documentation</p>
                <Panel.Actions>
                  {specProvided && (
                    <>
                      <Dropdown
                        options={{ JSON: 'JSON', YAML: 'YAML' }}
                        selectedOption={format}
                        onSelect={setFormat}
                        disabled={!specProvided}
                        className="fd-has-margin-right-s"
                        width="90px"
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
                    format={format}
                    verifyApi={verifyEventApiInput}
                    revalidateForm={revalidateForm}
                  />
                )}
              </Panel.Body>
            </Panel>
          </Tab>
        </TabGroup>
      </form>
    </>
  );
}

EditEventApiWrapper.propTypes = {
  eventApiDataQuery: PropTypes.object.isRequired,
  ...commonPropTypes,
};

export default function EditEventApiWrapper(props) {
  const dataQuery = props.eventApiDataQuery;

  if (dataQuery.loading) {
    return <p>Loading...</p>;
  }
  if (dataQuery.error) {
    return <p>`Error! ${dataQuery.error.message}`</p>;
  }

  // there's no getEventApiById query
  const originalEventApi = dataQuery.application.eventDefinitions.data.find(
    eventApi => eventApi.id === props.eventApiId,
  );

  if (!originalEventApi) {
    return (
      <ResourceNotFound resource="Event Definition" breadcrumb="Applications" />
    );
  }

  return (
    <EditEventApi
      {...props}
      originalEventApi={originalEventApi}
      applicationName={dataQuery.application.name}
    />
  );
}
