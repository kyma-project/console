import React from 'react';
import PropTypes from 'prop-types';

import { Panel, TabGroup, Tab, Button } from 'fundamental-react';
import EditApiHeader from './../EditApiHeader/EditApiHeader';
import ApiEditorForm from '../Forms/ApiEditorForm';
import EventApiForm from '../Forms/EventApiForm';
import { createEventAPIData, verifyEventApiInput } from './../ApiHelpers';
import {
  getRefsValues,
  Dropdown,
  useNotification,
  ResourceNotFound,
} from 'react-shared';
import './EditEventApi.scss';

import { GET_APPLICATION_WITH_EVENT_DEFINITIONS } from 'gql/queries';
import { UPDATE_EVENT_DEFINITION } from 'gql/mutations';
import { CompassGqlContext } from 'index';
import { useQuery, useMutation } from '@apollo/react-hooks';

EditEventApi.propTypes = {
  eventApiId: PropTypes.string.isRequired,
  originalEventApi: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
};

function EditEventApi({ eventApiId, originalEventApi, application }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const notificationManager = useNotification();

  const [updateEventDefinition] = useMutation(UPDATE_EVENT_DEFINITION, {
    client: compassGqlClient,
  });

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
      await updateEventDefinition({
        variables: {
          id: eventApiId,
          in: eventApiData,
        },
      });
      notificationManager.notifySuccess({
        content: `Updated Event "${basicData.name}".`,
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

  return (
    <>
      <EditApiHeader
        api={originalEventApi}
        application={application}
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
  appId: PropTypes.string.isRequired,
  eventApiId: PropTypes.string.isRequired,
};

export default function EditEventApiWrapper({ appId, eventApiId }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const { loading, data, error } = useQuery(
    GET_APPLICATION_WITH_EVENT_DEFINITIONS,
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

  // there's no getEventApiById query
  const originalEventApi = data.application.eventDefinitions.data.find(
    eventApi => eventApi.id === eventApiId,
  );

  if (!originalEventApi) {
    return (
      <ResourceNotFound
        resource="Event Definition"
        breadcrumb="Applications"
        path={`details/${appId}`}
      />
    );
  }

  return (
    <EditEventApi
      eventApiId={eventApiId}
      originalEventApi={originalEventApi}
      application={data.application}
    />
  );
}
