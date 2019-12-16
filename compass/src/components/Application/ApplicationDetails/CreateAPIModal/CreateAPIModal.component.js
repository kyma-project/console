import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal } from './../../../../shared/components/Modal/Modal';
import { Button, TabGroup, Tab, InlineHelp } from 'fundamental-react';

import './style.scss';

import {
  createAPIDefinition,
  createEventDefinition,
} from './../../../Api/APICreationHelper';

import APIDataForm from './../../../Api/Forms/ApiDataForm';
import CredentialsForm, {
  CREDENTIAL_TYPE_PLACEHOLDER,
} from '../../../Api/Forms/CredentialForms/CredentialsForm';

export default class CreateAPIModal extends React.Component {
  state = this.createInitialState();
  formRef = React.createRef();

  createInitialState() {
    return {
      isReadyToUpload: false,

      apiData: {
        name: '',
        description: '',
        group: '',
        targetURL: '',

        spec: null,
        actualFileType: null,
        loadedFileContent: null,
        mainAPIType: null /* API, EVENT_API, UNKNOWN */,
        apiSubType: null /* ASYNC_API, OPEN_API, ODATA */,
      },

      credentials: {
        type: CREDENTIAL_TYPE_PLACEHOLDER,
        oAuth: {
          clientId: '',
          clientSecret: '',
          url: '',
        },
      },
    };
  }

  shouldShowCredentialsPrompt = () => {
    const { mainAPIType } = this.state.apiData;

    if (mainAPIType === 'API') {
      const { type } = this.state.credentials;
      return type === CREDENTIAL_TYPE_PLACEHOLDER;
    }
    return false;
  };

  updateState = key => values => {
    const state = { ...this.state };
    state[key] = { ...state[key], ...values };
    this.setState({ ...state }, () => {
      this.setState({
        isReadyToUpload: this.checkInputValidity(),
      });
    });
  };

  showCreateSuccessNotification(apiName, isAsyncAPI) {
    const content = isAsyncAPI
      ? `Event API "${apiName}" created.`
      : `API "${apiName}" created.`;

    this.props.sendNotification({
      variables: {
        content,
        title: `${apiName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: apiName,
      },
    });
  }

  checkInputValidity = () => {
    const form = this.formRef;
    const { spec, mainAPIType } = this.state.apiData;
    const type = this.state.credentials.type;

    if (mainAPIType === 'API' && type === CREDENTIAL_TYPE_PLACEHOLDER) {
      return false;
    }
    if (!spec) {
      return false;
    }
    return form.current && form.current.checkValidity(); //check compat
  };

  addSpecification = async () => {
    const { props, state } = this;

    const isAsyncAPI = state.apiData.mainAPIType === 'ASYNC_API';
    const mutation = isAsyncAPI
      ? props.addEventDefinition
      : props.addAPIDefinition;

    const data = isAsyncAPI
      ? createEventDefinition(state)
      : createAPIDefinition(state);
    try {
      await mutation(data, props.applicationId);
      this.showCreateSuccessNotification(state.apiData.name, isAsyncAPI);
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  // prevent submit when user clicks on dropdown (or any other button inside form)
  overrideSubmit = e => {
    e.preventDefault();
  };

  render() {
    const mainAPIType = this.state.apiData.mainAPIType;
    const credentials = this.state.credentials;

    const modalOpeningComponent = <Button option="light">Add</Button>;
    const isAPI = mainAPIType === 'API';

    let credentialsTabText;
    if (!mainAPIType) {
      credentialsTabText = 'Please upload valid API spec file.';
    } else if (!isAPI) {
      credentialsTabText = 'Credentials can be only specified for APIs.';
    }

    const content = (
      <form onSubmit={this.overrideSubmit} ref={this.formRef}>
        <TabGroup>
          <Tab key="api-data" id="api-data" title="API data">
            <APIDataForm
              mainAPIType={mainAPIType}
              updateState={this.updateState('apiData')}
            />
          </Tab>
          <Tab
            key="credentials"
            id="credentials"
            title="Credentials"
            disabled={!isAPI}
          >
            <CredentialsForm
              updateState={this.updateState('credentials')}
              credentials={credentials}
            />
          </Tab>
          {!isAPI && (
            <InlineHelp placement="bottom-left" text={credentialsTabText} />
          )}
          {this.shouldShowCredentialsPrompt() && (
            <p className="credentials-tab__prompt-dot"></p>
          )}
        </TabGroup>
      </form>
    );

    return (
      <Modal
        title="Add Specification"
        confirmText="Add"
        cancelText="Cancel"
        type={'emphasized'}
        modalOpeningComponent={modalOpeningComponent}
        onConfirm={this.addSpecification}
        disabledConfirm={!this.state.isReadyToUpload}
        onShow={() => this.setState(this.createInitialState())}
      >
        {content}
      </Modal>
    );
  }
}

CreateAPIModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
  sendNotification: PropTypes.func.isRequired,
  addAPIDefinition: PropTypes.func.isRequired,
  addEventDefinition: PropTypes.func.isRequired,
};
