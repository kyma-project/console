import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
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
import SchemaValidator from './validator/SchemaValidator';
import { SPEC_UNKNOWN } from './validator/SchemaValidator';

import {
  isFileTypeValid,
  parseSpecFromText,
} from './APIUploadHelper';

import FileInput from './FileInput';
import TextFormItem from './TextFormItem';

// create graphql-ready form of API
function createAPI(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    targetURL: apiData.targetURL,
    group: apiData.group ? apiData.group : null, // if group is '', just write null
    spec: {
      data: apiData.loadedFileContent,
      format: apiData.actualFileType,
      type: apiData.apiSubType,
    },
    defaultAuth: {
      credential: {
        oauth: {
          clientId: apiData.oAuthCredentialData.clientId,
          clientSecret: apiData.oAuthCredentialData.clientSecret,
          url: apiData.oAuthCredentialData.url,
        },
      },
    },
  };
}

// create graphql-ready form of Event API
function createEventAPI(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    group: apiData.group ? apiData.group : null, // if group is '', just write null
    spec: {
      data: apiData.loadedFileContent,
      format: apiData.actualFileType,
      eventSpecType: apiData.apiSubType,
    },
  };
}

export default class CreateAPIModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.createInitialState();
    this.validator = new SchemaValidator();

    this.fileInputChanged = this.fileInputChanged.bind(this);
    this.isReadyToUpload = this.isReadyToUpload.bind(this);
    this.addSpecification = this.addSpecification.bind(this);
    this.fileInputChanged = this.fileInputChanged.bind(this);
  }

  setInitialState() {
    this.setState(this.createInitialState());
  }

  createInitialState() {
    return {
      name: '',
      description: '',
      group: '',
      targetURL: '',
      specFile: null,
      oAuthCredentialData: {
        clientId: '',
        clientSecret: '',
        url: '',
      },
  
      spec: null,
      actualFileType: null,
      loadedFileContent: null,
      mainAPIType: null, /* API, EVENT_API, UNKNOWN */
      apiSubType: null, /* ASYNC_API, OPEN_API, ODATA */
      currentError: null,
    }
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

  isReadyToUpload() {
    const { spec, name, mainAPIType, targetURL } = this.state;

    if (!spec || !name.trim()) {
      return false;
    }

    if (mainAPIType === 'API') {
      const { clientId, clientSecret, url } = this.state.oAuthCredentialData;
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

    this.setState({ specFile: null, mainAPIType: null, spec: null });

    if (!isFileTypeValid(file)) {
      this.setState({ currentError: 'Error: Invalid file type.' });
      return;
    }

    this.setState({ specFile: file, currentError: null });

    const reader = new FileReader();
    reader.onload = this.processFile.bind(this);
    reader.readAsText(file);
  }

  processFile(e) {
    const fileContent = e.target.result;
    const parsedSpec = parseSpecFromText(fileContent);
    console.log(parsedSpec);
    return;

    if (parsedSpec !== null) {
      const result = this.validator.validateSpec(parsedSpec.spec);
      this.setState({
        mainAPIType: result.mainType,
        apiSubType: result.apiType,
        spec: parsedSpec,
        loadedFileContent: fileContent,
        currentError: result.mainAPIType === SPEC_UNKNOWN ? 
          'Unknown spec type' : result.errors,
        actualFileType: parsedSpec.type
      });
    } else {
      this.setState({
        specFile: null,
        mainmainAPIType: null,
        spec: null,
        loadedFileContent: null,
        currentError: 'Error: Spec file is corrupted.',
      });
    }
  }

  async addSpecification() {
    const isAsyncAPI = this.state.mainAPIType === 'EVENT_API';
    const mutation = isAsyncAPI ? this.props.addEventAPI : this.props.addAPI;
    const apiData = isAsyncAPI
      ? createEventAPI(this.state)
      : createAPI(this.state);

    try {
      await mutation(apiData, this.props.applicationId);
      this.showCreateSuccessNotification(this.state.name, isAsyncAPI);
    } catch (error) {
      console.warn(error);
      showErrorPrompt(error.message);
    }
  }

  render() {
    const isEventAPI = this.state.mainAPIType === 'API';

    let credentialsTabText;
    if (isEventAPI) {
      credentialsTabText = 'Credentials can be only specified for APIs.';
    } else if (!this.state.mainAPIType) {
      credentialsTabText = 'Please upload the API spec file.';
    }

    let targetUrlInfoText;
    if (isEventAPI) {
      targetUrlInfoText = 'Target URL can be only specified for APIs.';
    } else if (!this.state.mainAPIType) {
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
                error={this.state.currentError}
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
              onChange={e =>
                this.setState({
                  oAuthCredentialData: {
                    ...this.state.oAuthCredentialData,
                    clientId: e.target.value,
                  },
                })
              }
            />
            <TextFormItem
              inputKey="client-secret"
              required
              type="password"
              label="Client Secret"
              defaultValue={this.state.clientSecret}
              onChange={e =>
                this.setState({
                  oAuthCredentialData: {
                    ...this.state.oAuthCredentialData,
                    clientSecret: e.target.value,
                  },
                })
              }
            />
            <TextFormItem
              inputKey="url"
              required
              type="url"
              label="Url"
              defaultValue={this.state.url}
              onChange={e =>
                this.setState({
                  oAuthCredentialData: {
                    ...this.state.oAuthCredentialData,
                    url: e.target.value,
                  },
                })
              }
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
