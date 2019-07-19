import React from "react";
import PropTypes from "prop-types";
import LuigiClient from "@kyma-project/luigi-client";
import { withApollo } from "react-apollo";
// todo docs

import { Button, Modal, FormItem, FormInput, FormLabel } from "@kyma-project/react-components";
import { Tab, TabGroup, InlineHelp, FormSet } from "fundamental-react";
import "./style.scss";

//import { ADD_APPLICATION_API, ADD_APPLICATION_EVENT_API, GET_APPLICATION } from "../../gql";
import {
  isSpecAsyncAPI,
  isFileTypeValid,
  loadSpec,
  createAPI,
  createEventAPI,
  getSpecFileType
} from "./APIUploadHelper";

import FileInput from "./FileInput";
import TextFormItem from "./TextFormItem";

class AddAPIModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      group: "",
      targetUrl: "",
      specFile: null,
      spec: null,
      clientID: "",
      clientSecret: "",
      url: "",

      actualFileType: null,
      apiType: null
    };

    this.fileInputChanged = this.fileInputChanged.bind(this);
    this.isReadyToUpload = this.isReadyToUpload.bind(this);
    this.addSpecification = this.addSpecification.bind(this);
    this.fileInputChanged = this.fileInputChanged.bind(this);
  }

  setInitialState() {
    this.setState({
      name: "",
      description: "",
      group: "",
      targetUrl: "",
      specFile: null,
      spec: null,
      clientID: "",
      clientSecret: "",
      url: "", 

      actualFileType: null,
      apiType: null,
      currentFileError: null
    });
  }

  isReadyToUpload() {
    if (!this.state.spec || !this.state.name.trim()) {
      return false;
    }

    if (this.state.apiType === "API") {
      if (!this.state.clientID.trim() || !this.state.clientSecret.trim() || !this.state.url.trim() || !this.state.targetUrl.trim()) {
        return false;
      }
    }

    return true;
  }

  fileInputChanged(file) {
    if (!file) {
      return;
    }

    if (!isFileTypeValid(file)) {
      this.setState({currentFileError: "Invalid file type."});
      return;
    }

    this.setState({ specFile: file, currentFileError: null });

    const reader = new FileReader();
    reader.onload = this.processFile.bind(this);
    reader.readAsText(file);
  }

  processFile(e) {
    const fileContent = e.target.result;
    const parsedSpec = loadSpec(fileContent);

    if (parsedSpec !== null) {
      this.setState({
        spec: parsedSpec,
        actualFileType: getSpecFileType(fileContent),
        apiType: isSpecAsyncAPI(parsedSpec) ? "EVENT_API" : "API"
      });
    } else {
      this.setState({ specFile: null, apiType: null, spec: null, currentFileError: "Spec file is corrupted." });
    }
  }

  async addSpecification() {
    const isAsyncAPI = isSpecAsyncAPI(this.state.spec);
    if (isAsyncAPI) {
      console.log(createEventAPI(this.state));
    } else {
      console.log(createAPI(this.state));
    }
    // try {
    //   console.log(await props.client.mutate({
    //       mutation: UPDATE_APPLICATION,
    //       variables: {
    //         id: props.application.id,
    //         input: createFileInput()
    //       }
    //     }));
    // } catch (e) {
    //   console.warn(e);
    // }
  }

  render() {

    const isEventAPI = () => this.state.apiType === "API";

    let credentialsTabText;
    if (this.state.apiType === 'EVENT_API') {
      credentialsTabText = "Credentials can be only specified for APIs.";
    }
    else if (!this.state.apiType) {
      credentialsTabText =  "Please upload the API spec file."
    }
  
    let targetUrlInfoText;
    if (this.state.apiType === 'EVENT_API') {
      targetUrlInfoText = "Target URL can be only specified for APIs.";
    }
    else if (!this.state.apiType) {
      targetUrlInfoText = "Please upload the API spec file."
    }
  

    const modalOpeningComponent = <Button option="light">Add</Button>;

    const content = (
      <TabGroup>
        <Tab key="api-data" id="api-data" title="API data">
          <FormSet>
            <TextFormItem inputKey="name" required label="Name" defaultValue={this.state.name}
                onChange={e => this.setState({ name: e.target.value })} />
            <TextFormItem inputKey="description" label="Description" defaultValue={this.state.description}
                onChange={e => this.setState({ description: e.target.value })} />
            <TextFormItem inputKey="group" label="Group" defaultValue={this.state.group}
                onChange={e => this.setState({ group: e.target.value })} />
            <FormItem key="targetUrl">
              <FormLabel htmlFor="targetUrl" required className="target-url__label--info">
                Target URL
              </FormLabel>
              {!isEventAPI() && (
                <InlineHelp placement="right" text={targetUrlInfoText} />
              )}
              <FormInput
                disabled={!isEventAPI()}
                id="targetUrl"
                type="text"
                placeholder="Target URL"
                defaultValue={this.state.targetUrl}
                onChange={e => this.setState({ targetUrl: e.target.value })}
              />
            </FormItem>
            <FormItem key="spec">
              <FormLabel htmlFor="spec">Spec</FormLabel>
              <FileInput
                fileInputChanged={this.fileInputChanged}
                file={this.state.specFile}
                error={this.state.currentFileError} />
            </FormItem>
          </FormSet>
        </Tab>
        <Tab key="credentials" id="credentials" title="Credentials" disabled={!isEventAPI()}>
          <FormSet>
            <TextFormItem inputKey="client-id" required type="password" label="Client ID" defaultValue={this.state.clientID}
                onChange={e => this.setState({ clientID: e.target.value })} />
            <TextFormItem inputKey="client-secret" required type="password" label="Client Secret" defaultValue={this.state.clientSecret}
                onChange={e => this.setState({ clientSecret: e.target.value })} />
            <TextFormItem inputKey="url" required type="url" label="Url" defaultValue={this.state.url}
                onChange={e => this.setState({ url: e.target.value })} />
            </FormSet>
        </Tab>
        {!isEventAPI() && 
          <InlineHelp placement="right" text={credentialsTabText} /> }
      </TabGroup>
    );

    return (
      <Modal
        width={"480px"}
        title="Add Specification"
        confirmText="Add"
        cancelText="Cancel"
        type={"emphasized"}
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

AddAPIModal.propTypes = {
  application: PropTypes.object.isRequired
};

export default withApollo(AddAPIModal);
