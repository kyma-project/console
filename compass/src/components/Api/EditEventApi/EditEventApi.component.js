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

EditEventApi.propTypes = {
  eventApiId: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired, // used in container file
  eventApiDataQuery: PropTypes.object.isRequired,
  updateEventDefinition: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function EditEventApi({
  eventApiId,
  eventApiDataQuery,
  updateEventDefinition,
  sendNotification,
}) {
  const formRef = React.useRef(null);
  const [formValid, setFormValid] = React.useState(true);
  const [specProvided, setSpecProvided] = React.useState();
  const [originalEventApi, setOriginalEventApi] = React.useState(null);
  const [format, setFormat] = React.useState('');
  const [specText, setSpecText] = React.useState('');

  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
    group: React.useRef(null),
  };

  React.useEffect(() => {
    if (eventApiDataQuery.application) {
      const originalEventApi = eventApiDataQuery.application.eventDefinitions.data.find(
        eventApi => eventApi.id === eventApiId,
      );

      setOriginalEventApi(originalEventApi);
      setSpecProvided(!!originalEventApi.spec);
      if (originalEventApi.spec) {
        setFormat(originalEventApi.spec.format);
        setSpecText(originalEventApi.spec.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventApiDataQuery.application]);

  const revalidateForm = () =>
    setFormValid(!!formRef.current && formRef.current.checkValidity());

  if (eventApiDataQuery.loading) {
    return <p>Loading...</p>;
  }
  if (eventApiDataQuery.error) {
    return <p>`Error! ${eventApiDataQuery.error.message}`</p>;
  }

  if (!originalEventApi) {
    return (
      <ResourceNotFound resource="Event Definition" breadcrumb="Applications" />
    );
  }

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
        applicationName={eventApiDataQuery.application.name}
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
