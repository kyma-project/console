import React from 'react';
import PropTypes from 'prop-types';

import { TabGroup, Tab } from 'fundamental-react';
import { Panel } from '@kyma-project/react-components';
import './style.scss';

import APIGeneralInformationForm from './APIGeneralInformationForm';
import APISpecForm from './APISpecForm/APISpecForm';
import CredentialsForm from '../Forms/CredentialForms/CredentialsForm';

EditApiTabs.propTypes = {
  editedApi: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
};

export default function EditApiTabs({ editedApi, updateState }) {
  const isAPI = editedApi.apiType === 'API';
  return (
    <TabGroup>
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
            <APIGeneralInformationForm
              isAPI={isAPI}
              updateState={updateState('generalInformation')}
              apiInformation={editedApi.generalInformation}
            />
          </Panel.Body>
        </Panel>
      </Tab>

      <Tab key={'spec'} id={'spec'} title={'API'}>
        <Panel className="spec-editor-panel">
          <Panel.Header>
            <p className="fd-has-type-1">API Details</p>
          </Panel.Header>
          <Panel.Body>
            <APISpecForm
              updateState={updateState('spec')}
              spec={editedApi.spec}
            />
          </Panel.Body>
        </Panel>
      </Tab>

      {isAPI && (
        <Tab key={'credentials'} id={'credentials'} title={'Credentials'}>
          <Panel>
            <Panel.Header>
              <p className="fd-has-type-1">Credentials</p>
            </Panel.Header>
            <Panel.Body>
              <CredentialsForm
                credentials={editedApi.credentials}
                updateState={updateState('credentials')}
              />
            </Panel.Body>
          </Panel>
        </Tab>
      )}
    </TabGroup>
  );
}
