import React, { Component } from 'react';
import ReactModal from 'react-modal';
import builder from '../../commons/builder';
import { ModalContent } from './modal-styles';
import {
  ModalHeaderTextComponent,
  StepWrapperComponent,
  ModalFooterFirst,
  ModalFooterSecond,
  InputComponent,
  CheckboxComponent,
  SelectComponent,
} from './index';

ReactModal.setAppElement('#root');

const CUSTOM_MODAL_STYLES_1 = {
  content: {
    width: '680px',
    height: '400px',
    padding: '0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 32px 0 rgba(0, 0, 0, 0.2), 0 0 2px 0 rgba(0, 0, 0, 0.1)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const CUSTOM_MODAL_STYLES_2 = {
  content: {
    width: '680px',
    height: '550px',
    padding: '0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 32px 0 rgba(0, 0, 0, 0.2), 0 0 2px 0 rgba(0, 0, 0, 0.1)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      selectedExistingBinding: '',
      nameServiceBinding: '',
      nameServiceBindingUsage: '',
      selectedKind: '',
      selectedResource: '',
      usageKindResources: [],
      checkbox: false,
    };
    this.handleUsageKindChange = this.handleUsageKindChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.create = this.create.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open === true && this.props.open === false) {
      this.setState({
        step: 1,
        selectedExistingBinding: '',
        nameServiceBinding: this.props.data.serviceInstance.name + '-binding',
        nameServiceBindingUsage:
          this.props.data.serviceInstance.name + '-binding-usage',
        selectedKind: '',
        selectedResource: '',
        checkbox:
          this.props.data.serviceInstance.serviceBindings &&
          this.props.data.serviceInstance.serviceBindings.length
            ? false
            : true,
      });
    }
  }

  handleModal = () => {
    if (typeof this.props.handleSuccess === 'function') {
      this.props.handleSuccess();
    }

    this.closeModal();
  };

  closeModal = () => {
    if (typeof this.props.closeModal === 'function') {
      this.props.closeModal();
    }
  };

  handleCheckbox() {
    this.setState({ checkbox: !this.state.checkbox });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleUsageKindChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      usageKindResources: [],
      selectedResource: '',
    });
    if (event.target.value === '') {
      return;
    }

    try {
      const resp = await this.props.fetchUsageKindResources(event.target.value);
      this.prepareDataForUsageKindResourceCheckbox(resp.data);
    } catch (e) {
      console.log(e);
    }
}

  handleStep(text) {
    if ('previous' === text) {
      return this.setState({ step: 1 });
    }

    this.setState({ step: 2 });
  }

  prepareData() {
    return {
      name: this.state.nameServiceBindingUsage,
      environment: builder.getCurrentEnvironmentId(),
      serviceBindingRef: {
        name: this.state.checkbox
          ? this.state.nameServiceBinding
          : this.state.selectedExistingBinding,
      },
      usedBy: {
        kind: this.state.selectedKind.split(' ')[0].toUpperCase(),
        name: this.state.selectedResource,
      },
    };
  }

  async create() {
    const dataToSend = this.prepareData();

    try {
      if (this.state.checkbox) {
        await this.props.createBinding(
          this.state.nameServiceBinding,
          this.props.data.serviceInstance.name,
        );
      }

      await this.props.createBindingUsage(dataToSend);
      await this.handleModal();
    } catch (e) {
      console.log(e);
    }
  }

  displayModalContentFirstStep(existingServiceBindings) {
    if (this.state.checkbox) {
      return (
        <InputComponent
          labelName={'Name'}
          placeholder={'Specify a name for your new Service Binding'}
          value={this.state.nameServiceBinding}
          handleChange={this.handleChange}
          name={'nameServiceBinding'}
        />
      );
    }

    const items = existingServiceBindings.map((binding, index) => (
      <option key={index} value={binding.name}>
        {binding.name}
      </option>
    ));
    return (
      <SelectComponent
        labelName={'Select Existing Service Binding'}
        handleChange={this.handleChange}
        name={'selectedExistingBinding'}
        current={this.state.selectedExistingBinding}
        mappedItems={items}
      />
    );
  }

  prepareDataForUsageKindResourceCheckbox(resources) {
    const mappedResources = resources.usageKindResources.map(obj => (
      <option key={obj.name} value={obj.name}>
        {obj.name}
      </option>
    ));
    this.setState({
      usageKindResources: mappedResources,
    });
  }

  render() {
    if (!this.props.open) {
      return null;
    }

    const data = this.props.data || {};
    const { serviceInstance } = data;
    const { usageKinds } = this.props;

    if (!data || !serviceInstance || !usageKinds) {
      return null;
    }
    const existingServiceBindings = serviceInstance.serviceBindings;

    const mappedUsageKinds = usageKinds.usageKinds.map(obj => (
      <option key={obj.name} value={obj.name}>
        {obj.displayName}
      </option>
    ));

    const {
      nameServiceBinding,
      checkbox,
      selectedExistingBinding,
      nameServiceBindingUsage,
      selectedKind,
      selectedResource,
    } = this.state;
    const nextBtnEnabled =
      (checkbox && nameServiceBinding !== '') ||
      (!checkbox && selectedExistingBinding !== '');

    const createBtnEnabled =
      nameServiceBindingUsage !== '' &&
      selectedKind !== '' &&
      selectedResource !== '';

    return (
      <div>
        <ReactModal
          isOpen={this.state.step === 1}
          contentLabel="Modal #1"
          onRequestClose={this.closeModal}
          style={CUSTOM_MODAL_STYLES_1}
        >
          <ModalHeaderTextComponent
            text={'Create Binding'}
            handleModal={this.closeModal}
          />
          <StepWrapperComponent
            step={this.state.step}
            firstText={'Service Binding'}
            secondText={'Service Binding Usage'}
          />
          <ModalContent>
            <CheckboxComponent
              labelName={'Create new Service Binding'}
              onChange={this.handleCheckbox}
              checked={this.state.checkbox}
            />
            {this.displayModalContentFirstStep(existingServiceBindings)}
          </ModalContent>
          <ModalFooterFirst
            handleModal={this.closeModal}
            handleStep={() => this.handleStep('next')}
            nextBtnEnabled={nextBtnEnabled}
          />
        </ReactModal>

        <ReactModal
          isOpen={this.state.step === 2}
          contentLabel="Modal #2"
          onRequestClose={this.handleModal}
          style={CUSTOM_MODAL_STYLES_2}
        >
          <ModalHeaderTextComponent
            text={'Create Binding'}
            handleModal={this.handleModal}
          />
          <StepWrapperComponent
            step={this.state.step}
            firstText={'Service Binding'}
            secondText={'Service Binding Usage'}
          />
          <ModalContent>
            <InputComponent
              labelName={'Name'}
              placeholder={'Specify a name for your new Service Binding Usage'}
              value={this.state.nameServiceBindingUsage}
              handleChange={this.handleChange}
              name={'nameServiceBindingUsage'}
            />
            <SelectComponent
              labelName={'Usage Kind'}
              handleChange={this.handleUsageKindChange}
              name={'selectedKind'}
              current={this.state.selectedKind}
              mappedItems={mappedUsageKinds}
            />
            {this.state.selectedKind === '' ? null : (
              <SelectComponent
                labelName={'Resources'}
                handleChange={this.handleChange}
                name={'selectedResource'}
                current={this.state.selectedResource}
                mappedItems={this.state.usageKindResources}
              />
            )}
          </ModalContent>
          <ModalFooterSecond
            handleModal={this.handleModal}
            handleStep={() => this.handleStep('previous')}
            create={this.create}
            createBtnEnabled={createBtnEnabled}
          />
        </ReactModal>
      </div>
    );
  }
}

export default Modal;
