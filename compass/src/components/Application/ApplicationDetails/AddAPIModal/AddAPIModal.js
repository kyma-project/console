import React from "react";
import PropTypes from "prop-types";
import LuigiClient from "@kyma-project/luigi-client";
import { withApollo } from "react-apollo";
import './style.scss';

import { Button, Modal } from "@kyma-project/react-components";
import { ADD_APPLICATION_API, ADD_APPLICATION_EVENT_API, GET_APPLICATION } from "../../gql";
import { getFileType, isSpecAsyncAPI, getAPISpecType, isFileTypeValid, getAsyncAPISpecType, loadSpec, createAPI, createEventAPI } from './APIUploadHelper';
import classNames from 'classnames';

import { FormSet, FormItem, FormInput, FormLabel } from "fundamental-react";

class AddAPIModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      specFile: null,
      spec: null,
      draggingOverCounter: 0
    };

    this.fileInputChanged = this.fileInputChanged.bind(this);
    this.isReadyToUpload = this.isReadyToUpload.bind(this);
    this.addSpecification = this.addSpecification.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragLeave =this.dragLeave.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.drop = this.drop.bind(this);
  }

  // needed for onDrag to fire
  dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  dragEnter() {
    this.setState({draggingOverCounter: this.state.draggingOverCounter + 1});
  }

  dragLeave() {
    this.setState({draggingOverCounter: this.state.draggingOverCounter - 1});
  }

  drop(e) {
    this.setState({draggingOverCounter: 0});
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation(); // to avoid event.js error
    this.fileInputChanged(e.dataTransfer.files[0])
  }

  setInitialState() {
    this.setState({
      name: "",
      specFile: null,
      spec: null,
      draggingOverCounter: 0
    });
  }

  isReadyToUpload() {
    console.log(this.state.name);
    return this.state.trim() !== "" && false; // todo
  }
  
  fileInputChanged(file) {
    console.log(file);
    this.setState({specFile: file});

    if (!isFileTypeValid(file)) {
      console.log('brzydki typ pliku');
      return;
    }

    console.log(getFileType(file))
    const reader = new FileReader();
    reader.onload = this.processFile.bind(this);
    reader.readAsText(file);
  }

  handleDrop(e) {
    e.preventDefault();
    this.fileInputChanged(e.dataTransfer.files[0]);
  }

  processFile(e) {
    const fileContent = e.target.result;
    const parsedSpec = loadSpec(fileContent);

    if (parsedSpec !== null) {
      this.setState({spec: parsedSpec});
      
      const isasync = isSpecAsyncAPI(parsedSpec);
      console.log('is async: ' + isasync);
      if (isasync) {
        console.log('typ: ', getAsyncAPISpecType(parsedSpec))
      }
      else {
        console.log('typ: ', getAPISpecType(parsedSpec));
      }
    }

    else {
      console.log('blad w pliczku');
    }
  }

  async addSpecification() {
    const isAsyncAPI = isSpecAsyncAPI(this.state.spec);
    
    if (isAsyncAPI) {
      console.log(createAPI(this.state.name, this.state.specFile, this.state.spec));
    }
    else {
      console.log(createEventAPI(this.state.name, this.state.specFile, this.state.spec));
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
    const modalOpeningComponent = <Button option="light">Add</Button>;

    const labelClass = classNames('fd-file-upload__label', 
      { 'fd-file-upload__input--drag-over': this.state.draggingOverCounter !== 0 });

    const content = (
      <FormSet>
        <FormItem key="name">
          <FormLabel htmlFor="name" required={true}>
            Name
          </FormLabel>
          <FormInput
            id="name"
            type="text"
            placeholder={"Name"}
            defaultValue={this.state.name}
            onChange={e => this.setState( {name: e.target.value} )}
          />
        </FormItem>
        <FormItem key="spec">
          <FormLabel htmlFor="spec">Spec</FormLabel>
          <div className="fd-file-upload"
            onDrop={this.drop}
            onDragEnter={this.dragEnter}
            onDragLeave={this.dragLeave} 
            onDragOver = {this.dragOver}>
            {!!this.state.specFile && 
              <p className="file-name">{this.state.specFile.name}</p>
            }
            <input type="file"
              id="file-upload"
              className="fd-file-upload__input"
              onChange={e => this.fileInputChanged(e.target.files[0])}
              accept=".yml,.yaml,.json"/>
            <label htmlFor="file-upload" className={labelClass}>
              <span className="fd-file-upload__text">Browse</span>
              <p className="fd-file-upload__message"> or drop file here</p>
              <p className="fd-file-upload__message">Available file types: JSON, YAML.</p>
            </label>
          </div>
        </FormItem>
      </FormSet>
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
      disableConfirm={!this.isReadyToUpload}
      onShow={() => {
        console.log(this);
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
