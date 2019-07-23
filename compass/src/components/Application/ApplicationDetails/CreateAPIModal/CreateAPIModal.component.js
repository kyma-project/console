import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
// todo docs

import { showErrorPrompt } from './../../../../shared/utility';

import {
  Button,
  Modal,
  FormItem,
  FormInput,
  FormLabel,
} from '@kyma-project/react-components';
import { Tab, TabGroup, InlineHelp } from 'fundamental-react';
import './style.scss';

import {
  getSpecType,
  isFileTypeValid,
  parseSpecFromText,
  getSpecFileType,
  getAPISpecType,
  getAsyncAPISpecType,
} from './APIUploadHelper';

import FileInput from './FileInput';
import TextFormItem from './TextFormItem';

// create grapql-ready form of API
function createAPI(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    targetURL: apiData.targetURL,
    group: apiData.group ? apiData.group : null,
    spec: {
      data: JSON.stringify(apiData.spec),
      format: apiData.actualFileType,
      type: getAPISpecType(apiData.spec),
    },
    defaultAuth: {
      credential: {
        oauth: {
          clientId: apiData.clientId,
          clientSecret: apiData.clientSecret,
          url: apiData.url,
        },
      },
    },
  };
}

// create grapql-ready form of Event API
function createEventAPI(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    group: apiData.group ? apiData.group : null,
    spec: {
      data: JSON.stringify(apiData.spec),
      format: apiData.actualFileType,
      eventSpecType: getAsyncAPISpecType(apiData.spec),
    },
  };
}

export default class CreateAPIModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      group: '',
      targetURL: '',
      specFile: null,
      spec: null,
      clientId: '',
      clientSecret: '',
      url: '',

      actualFileType: null,
      apiType: null,
    };

    this.fileInputChanged = this.fileInputChanged.bind(this);
    this.isReadyToUpload = this.isReadyToUpload.bind(this);
    this.addSpecification = this.addSpecification.bind(this);
    this.fileInputChanged = this.fileInputChanged.bind(this);
  }

  setInitialState() {
    this.setState({
      name: '',
      description: '',
      group: '',
      targetURL: '',
      specFile: null,
      spec: null,
      clientId: '',
      clientSecret: '',
      url: '',

      actualFileType: null,
      apiType: null,
      currentFileError: null,
    });
  }

  showSuccessNotification(apiName, isAsyncAPI) {
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
    if (!this.state.spec || !this.state.name.trim()) {
      return false;
    }

    if (this.state.apiType === 'API') {
      const { targetURL, clientId, clientSecret, url } = this.state;
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

  fileInputChanged(file) {
    if (!file) {
      return;
    }

    this.setState({ specFile: null, apiType: null, spec: null });

    if (!isFileTypeValid(file)) {
      this.setState({ currentFileError: 'Error: Invalid file type.' });
      return;
    }

    this.setState({ specFile: file, currentFileError: null });

    const reader = new FileReader();
    reader.onload = this.processFile.bind(this);
    reader.readAsText(file);
  }

  processFile(e) {
    const fileContent = e.target.result;
    const parsedSpec = parseSpecFromText(fileContent);

    if (parsedSpec !== null) {
      this.setState({
        spec: parsedSpec,
        actualFileType: getSpecFileType(fileContent),
        apiType: getSpecType(parsedSpec),
      });
    } else {
      this.setState({
        specFile: null,
        apiType: null,
        spec: null,
        currentFileError: 'Error: Spec file is corrupted.',
      });
    }
  }

  async addSpecification() {
    const isAsyncAPI = this.state.apiType === 'EVENT_API';
    const mutation = isAsyncAPI ? this.props.addEventAPI : this.props.addAPI;
    const apiData = isAsyncAPI ? createEventAPI(this.state) : createAPI(this.state);

    try {
      await mutation(apiData, this.props.applicationId);
      this.showSuccessNotification(this.state.name, isAsyncAPI);
    } catch (error) {
      console.warn(error);
      showErrorPrompt(error.message);
    }
  }

  render() {
    const isEventAPI = this.state.apiType === 'API';

    let credentialsTabText;
    if (this.state.apiType === 'EVENT_API') {
      credentialsTabText = 'Credentials can be only specified for APIs.';
    } else if (!this.state.apiType) {
      credentialsTabText = 'Please upload the API spec file.';
    }

    let targetUrlInfoText;
    if (this.state.apiType === 'EVENT_API') {
      targetUrlInfoText = 'Target URL can be only specified for APIs.';
    } else if (!this.state.apiType) {
      targetUrlInfoText = 'Please upload the API spec file.';
    }

    const modalOpeningComponent = <Button option="light">Add API</Button>;

    const content = (
      <TabGroup>
        <Tab key="api-data" id="api-data" title="API data">
          <form>
            <TextFormItem
              inputKey="name"
              required
              label="Name"
              defaultValue={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <TextFormItem
              inputKey="description"
              label="Description"
              defaultValue={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
            <TextFormItem
              inputKey="group"
              label="Group"
              defaultValue={this.state.group}
              onChange={e => this.setState({ group: e.target.value })}
            />
            <FormItem key="targetURL">
              <FormLabel
                htmlFor="targetURL"
                required
                className="target-url__label--info"
              >
                Target URL
              </FormLabel>
              {!isEventAPI && (
                <InlineHelp placement="right" text={targetUrlInfoText} />
              )}
              <FormInput
                disabled={!isEventAPI}
                id="targetURL"
                type="text"
                placeholder="Target URL"
                defaultValue={this.state.targetURL}
                onChange={e => this.setState({ targetURL: e.target.value })}
              />
            </FormItem>
            <FormItem key="spec">
              <FormLabel htmlFor="spec">Spec</FormLabel>
              <FileInput
                fileInputChanged={this.fileInputChanged}
                file={this.state.specFile}
                error={this.state.currentFileError}
              />
            </FormItem>
          </form>
        </Tab>
        <Tab
          key="credentials"
          id="credentials"
          title="Credentials"
          disabled={!isEventAPI}
        >
          <form>
            <TextFormItem
              inputKey="client-id"
              required
              type="password"
              label="Client ID"
              defaultValue={this.state.clientId}
              onChange={e => this.setState({ clientId: e.target.value })}
            />
            <TextFormItem
              inputKey="client-secret"
              required
              type="password"
              label="Client Secret"
              defaultValue={this.state.clientSecret}
              onChange={e => this.setState({ clientSecret: e.target.value })}
            />
            <TextFormItem
              inputKey="url"
              required
              type="url"
              label="Url"
              defaultValue={this.state.url}
              onChange={e => this.setState({ url: e.target.value })}
            />
          </form>
        </Tab>
        {!isEventAPI && (
          <InlineHelp placement="right" text={credentialsTabText} />
        )}
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
          this.setInitialState();
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

