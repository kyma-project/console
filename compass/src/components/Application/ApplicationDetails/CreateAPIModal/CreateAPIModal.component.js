import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

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
  isFileTypeValid,
  parseSpecFromText,
  getSpecType,
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
      mainAPIType: null /* API, EVENT_API, UNKNOWN */,
      apiSubType: null /* ASYNC_API, OPEN_API, ODATA */,
      currentError: null,
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

    if (!parsedSpec) {
      this.setState({ currentError: 'Error: API spec file is invalid.' });
      return;
    }
    const type = getSpecType(parsedSpec.spec);

    if (!type) {
      this.setState({ currentError: 'Error: cannot recognize spec file.' });
      return;
    }

    this.setState({
      spec: parsedSpec,
      mainAPIType: type.mainType,
      apiSubType: type.subType,
      actualFileType: parsedSpec.type,
      currentError: null,
      loadedFileContent: fileContent,
    });
  }

  async addSpecification() {
    const { props, state } = this;

    const isAsyncAPI = state.mainAPIType === 'ASYNC_API';
    const mutation = isAsyncAPI ? props.addEventAPI : props.addAPI;

    const apiData = isAsyncAPI ? createEventAPI(state) : createAPI(state);

    try {
      await mutation(apiData, props.applicationId);
      this.showCreateSuccessNotification(state.name, isAsyncAPI);
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
    const {
      name,
      description,
      group,
      targetURL,
      mainAPIType,
      specFile,
      currentError,
      oAuthCredentialData,
    } = this.state;

    const isAsyncAPI = mainAPIType === 'ASYNC_API';
    const isAPI = mainAPIType === 'API';

    let credentialsTabText;
    if (isAsyncAPI) {
      credentialsTabText = 'Credentials can be only specified for APIs.';
    } else if (!mainAPIType) {
      credentialsTabText = 'Please upload valid API spec file.';
    }

    let targetUrlInfoText;
    if (isAsyncAPI) {
      targetUrlInfoText = 'Target URL can be only specified for APIs.';
    } else if (!mainAPIType) {
      targetUrlInfoText = 'Please upload valid API spec file.';
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
              defaultValue={name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <TextFormItem
              inputKey="description"
              label="Description"
              defaultValue={description}
              onChange={e => this.setState({ description: e.target.value })}
            />
            <TextFormItem
              inputKey="group"
              label="Group"
              defaultValue={group}
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
              {!isAPI && (
                <InlineHelp placement="right" text={targetUrlInfoText} />
              )}
              <FormInput
                disabled={!isAPI}
                id="targetURL"
                type="text"
                placeholder="Target URL"
                defaultValue={targetURL}
                onChange={e => this.setState({ targetURL: e.target.value })}
              />
            </FormItem>
            <FormItem key="spec">
              <FormLabel htmlFor="spec">Spec</FormLabel>
              <FileInput
                fileInputChanged={this.fileInputChanged}
                file={specFile}
                error={currentError}
              />
            </FormItem>
          </form>
        </Tab>
        <Tab
          key="credentials"
          id="credentials"
          title="Credentials"
          disabled={!isAPI}
        >
          <form>
            <TextFormItem
              inputKey="client-id"
              required
              type="password"
              label="Client ID"
              defaultValue={oAuthCredentialData.clientId}
              onChange={e =>
                this.setState({
                  oAuthCredentialData: {
                    ...oAuthCredentialData,
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
              defaultValue={oAuthCredentialData.clientSecret}
              onChange={e =>
                this.setState({
                  oAuthCredentialData: {
                    ...oAuthCredentialData,
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
              defaultValue={oAuthCredentialData.url}
              onChange={e =>
                this.setState({
                  oAuthCredentialData: {
                    ...oAuthCredentialData,
                    url: e.target.value,
                  },
                })
              }
            />
          </form>
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
