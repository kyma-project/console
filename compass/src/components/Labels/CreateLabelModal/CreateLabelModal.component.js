import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import {
  isFileTypeValid,
  parseSpecification,
} from './LabelSpecificationUploadHelper';

import {
  FormMessage,
  FormItem,
  FormInput,
  FormLabel,
  Button,
} from 'fundamental-react';
import FileInput from './../../Shared/FileInput/FileInput';
import { Modal } from './../../../shared/components/Modal/Modal';
import { readFile } from 'components/Api/ApiHelpers';

export default class CreateLabelModal extends React.Component {
  state = this.createInitialState();
  inputRef = React.createRef();

  createInitialState() {
    return {
      name: '',
      nameError: '',

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

  fileInputChanged = async file => {
    if (!file) {
      return;
    }

    this.setState({ specError: '' });

    if (!isFileTypeValid(file.name)) {
      this.setState({ specError: 'Error: Invalid file type.' });
      return;
    }

    this.processSpec(await readFile(file));
  };

  processSpec(fileContent) {
    const parsedSpec = parseSpecification(fileContent);

    this.setState({
      parsedSpec,
      specError: parsedSpec ? '' : 'Spec file is corrupted.',
    });
  }

  render() {
    const { specError, nameError } = this.state;

    const modalOpeningComponent = (
      <Button option="light">Add definition</Button>
    );

    const content = (
      <form>
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
            required
          />
          {nameError && <FormMessage type="error">{nameError}</FormMessage>}
        </FormItem>
        <FormItem key="label-schema">
          <FormLabel htmlFor="label-schema">Specification</FormLabel>
          <FileInput
            fileInputChanged={this.fileInputChanged}
            availableFormatsMessage={'File type: JSON, YAML.'}
            acceptedFileFormats=".json,.yml,.yaml"
            inputRef={this.inputRef}
          />
        </FormItem>
        {specError && <FormMessage type="error">{specError}</FormMessage>}
      </form>
    );

    return (
      <Modal
        title="Create Label"
        confirmText="Save"
        cancelText="Cancel"
        type={'emphasized'}
        modalOpeningComponent={modalOpeningComponent}
        onConfirm={this.addLabel}
        disabledConfirm={!this.isReadyToUpload()}
        onShow={() => this.setState(this.createInitialState())}
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
