import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, Button } from '@kyma-project/react-components';
import './style.scss';

import { createAPI, createEventAPI } from './APICreationHelper';
import { TabGroup, Tab, InlineHelp } from 'fundamental-react';

import APIDataForm from './Forms/ApiDataForm';
import CredentialsForm from './Forms/CredentialsForm';

export default class CreateAPIModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.createInitialState();

    this.addSpecification = this.addSpecification.bind(this);
    this.isReadyToUpload = this.isReadyToUpload.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  createInitialState() {
    return {
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

      credentialsData: {
        oAuth: {
          clientId: '',
          clientSecret: '',
          url: '',
        },
      },
    };
  }

  updateState(key) {
    return values => {
      const state = { ...this.state };
      state[key] = { ...state[key], ...values };
      this.setState({ ...state });
    };
  }

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

  isReadyToUpload() {
    const { spec, name, mainAPIType, targetURL } = this.state.apiData;

    if (!spec || !name.trim()) {
      return false;
    }

    if (mainAPIType === 'API') {
      const { clientId, clientSecret, url } = this.state.credentialsData.oAuth;
      if (
        !targetURL.trim() ||
        !clientId.trim() ||
        !clientSecret.trim() ||
        !url.trim()
      ) {
        return false;
      }
    }

    return true;
  }

  async addSpecification() {
    const { props, state } = this;

    const isAsyncAPI = state.apiData.mainAPIType === 'ASYNC_API';
    const mutation = isAsyncAPI ? props.addEventAPI : props.addAPI;

    const data = isAsyncAPI ? createEventAPI(state) : createAPI(state);
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
  }

  render() {
    const mainAPIType = this.state.apiData.mainAPIType;

    const modalOpeningComponent = <Button option="light">Add API</Button>;
    const isAPI = mainAPIType === 'API';

    let credentialsTabText;
    if (!mainAPIType) {
      credentialsTabText = 'Please upload valid API spec file.';
    } else if (!isAPI) {
      credentialsTabText = 'Credentials can be only specified for APIs.';
    }

    const content = (
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
          <CredentialsForm updateState={this.updateState('credentialsData')} />
        </Tab>
        {!isAPI && <InlineHelp placement="right" text={credentialsTabText} />}
      </TabGroup>
    );

    return (
      <Modal
        width={'480px'}
        title="Add Specification"
        confirmText="Add"
        cancelText="Cancel"
        type={'emphasized'}
        modalOpeningComponent={modalOpeningComponent}
        onConfirm={this.addSpecification}
        disabledConfirm={!this.isReadyToUpload()}
        onShow={() => {
          this.setState(this.createInitialState());
          LuigiClient.uxManager().addBackdrop();
        }}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {content}
      </Modal>
    );
  }
}

CreateAPIModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
  sendNotification: PropTypes.func.isRequired,
  addAPI: PropTypes.func.isRequired,
  addEventAPI: PropTypes.func.isRequired,
};
