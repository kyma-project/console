import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import {
  isFileTypeValid,
  parseSpecification,
} from './LabelSpecificationUploadHelper';

import { FormMessage } from 'fundamental-react';
import {
  FormItem,
  FormInput,
  FormLabel,
  Modal,
  Button,
} from '@kyma-project/react-components';
import FileInput from './../../Shared/FileInput/FileInput';

export default class CreateLabelModal extends React.Component {
  state = this.createInitialState();

  createInitialState() {
    return {
      name: '',
      nameError: '',

      specFile: null,
      specError: '',
      parsedSpec: null,
    };
  }

  updateLabelName = e => {
    const name = e.target.value;
    this.setState({ name });

    const labelAlreadyExists = this.props.labelNamesQuery.labelDefinitions.some(
      l => l.key === name,
    );

    if (labelAlreadyExists) {
      this.setState({ nameError: 'Label with this name already exists.' });
    } else {
      this.setState({ nameError: '' });
    }
  };

  addLabel = async () => {
    const { labelNamesQuery, createLabel, sendNotification } = this.props;
    const { name, parsedSpec } = this.state;

    try {
      await createLabel({
        key: name,
        schema: parsedSpec,
      });
      labelNamesQuery.refetch();
      sendNotification({
        variables: {
          content: `Label "${name}" created.`,
          title: `${name}`,
          color: '#359c46',
          icon: 'accept',
          instanceName: name,
        },
      });
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  isReadyToUpload = () => {
    const { name, nameError, spec, specError } = this.state;
    return name.trim() !== '' && !nameError && spec !== null && !specError;
  };

  fileInputChanged = newFile => {
    if (!newFile) {
      return;
    }

    this.setState({ specFile: newFile, specError: '' });

    if (!isFileTypeValid(newFile.name)) {
      this.setState({ specError: 'Error: Invalid file type.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = this.processFile.bind(this);
    reader.readAsText(newFile);
  };

  processFile(e) {
    const fileContent = e.target.result;
    const parsedSpec = parseSpecification(fileContent);

    this.setState({
      parsedSpec,
      specError: parsedSpec ? '' : 'Spec file is corrupted.',
    });
  }

  render() {
    const { nameError, specFile, specError } = this.state;

    const modalOpeningComponent = (
      <Button test-id="create-label-modal-button" glyph="add">
        Add definition
      </Button>
    );

    const content = (
      <form test-id="create-label-modal">
        <FormItem key="label-name">
          <FormLabel htmlFor="label-name" required>
            Name
          </FormLabel>
          <FormInput
            id="label-name"
            placeholder={'Name'}
            type="text"
            onChange={this.updateLabelName}
            autoComplete="off"
          />
          {nameError && <FormMessage type="error">{nameError}</FormMessage>}
        </FormItem>
        <FormItem key="label-schema">
          <FormLabel htmlFor="label-schema">Specification</FormLabel>
          <FileInput
            fileInputChanged={this.fileInputChanged}
            file={specFile}
            error={specError}
            availableFormatsMessage={'File type: JSON, YAML.'}
            acceptedFileFormats=".json,.yml,.yaml"
          />
        </FormItem>
      </form>
    );

    return (
      <Modal
        width={'480px'}
        title="Create Label"
        confirmText="Save"
        cancelText="Cancel"
        type={'emphasized'}
        modalOpeningComponent={modalOpeningComponent}
        onConfirm={this.addLabel}
        disabledConfirm={!this.isReadyToUpload()}
        onShow={() => {
          this.setState(this.createInitialState());
          LuigiClient.uxManager().addBackdrop();
        }}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {this.props.labelNamesQuery.loading ? (
          <p>Loading existing labels...</p>
        ) : (
          content
        )}
      </Modal>
    );
  }
}

CreateLabelModal.propTypes = {
  labelNamesQuery: PropTypes.object.isRequired,
  createLabel: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};
