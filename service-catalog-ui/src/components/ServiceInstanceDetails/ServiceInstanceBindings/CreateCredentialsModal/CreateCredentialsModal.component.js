import React, { Fragment } from 'react';

import { Tooltip as StatusTooltip } from '@kyma-project/react-components';
import { Button } from 'fundamental-react';
import { Modal, Tooltip } from 'react-shared';

// import SchemaData from './SchemaData.component';
import { bindingVariables } from '../InfoButton/variables';

import { clearEmptyPropertiesInObject } from 'helpers';
import LuigiClient from '@luigi-project/client';

import WithNotificationContext from '../WithNotificationContext/WithNotificationContext';

class CreateCredentialsModal extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const serviceInstance = this.props.serviceInstance;
    const servicePlan =
      (serviceInstance &&
        (serviceInstance.servicePlan || serviceInstance.clusterServicePlan)) ||
      [];
    const bindingCreateParameterSchema =
      (servicePlan && servicePlan.bindingCreateParameterSchema) || null;

    return {
      servicePlan: servicePlan,
      bindingCreateParameterSchema: bindingCreateParameterSchema,
      bindingCreateParameters: {},
      tooltipData: null,
    };
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  componentDidUpdate(nextProps, nextState) {
    if (nextState && nextState.tooltipData && nextState.tooltipData.show) {
      this.setState({
        tooltipData: null,
      });
    }
  }

  componentWillUnmount() {
    this.clearState();
  }

  callback = data => {
    this.setState({ ...data });
  };

  create = async isOpenedModal => {
    const { serviceInstance, createBinding } = this.props;
    const { bindingCreateParameters } = this.state;

    let success = true;

    try {
      clearEmptyPropertiesInObject(bindingCreateParameters);
      const createdBinding = await createBinding(
        serviceInstance.name,
        bindingCreateParameters,
      );
      let createdBindingName;
      if (
        createdBinding &&
        createdBinding.data &&
        createdBinding.data.createServiceBinding &&
        createdBinding.data.createServiceBinding.name
      ) {
        createdBindingName = createdBinding.data.createServiceBinding.name;
      }

      if (isOpenedModal) {
        this.child.child.handleCloseModal();
      }
      this.props.notification.open({
        content: `Credentials "${createdBindingName}" created successfully`,
        title: `${createdBindingName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: createdBindingName,
        visible: true,
      });
    } catch (e) {
      success = false;
      this.setState({
        tooltipData: {
          type: 'error',
          title: 'Error occurred during creation',
          content: e.message,
          show: true,
          minWidth: '261px',
        },
      });
    }
    if (success) {
      this.clearState();
      LuigiClient.uxManager().removeBackdrop();
    }
  };

  handleConfirmation = () => {
    this.create();
  };

  handleOpen = () => {
    const { bindingCreateParameterSchema } = this.state;
    if (!bindingCreateParameterSchema) {
      this.create(true);
    }
  };
  createWithoutOpening = () => {
    const { bindingCreateParameterSchema } = this.state;
    if (!bindingCreateParameterSchema) {
      this.create();
    }
  };

  render() {
    const {
      bindingCreateParameters,
      tooltipData,
      bindingCreateParameterSchema,
      // servicePlan,
    } = this.state;

    const { serviceInstance, id } = this.props;

    const disabled = !bindingCreateParameters;

    const schemaData = {
      bindingCreateParameters: bindingCreateParameters,
    };
    console.log(schemaData);

    const bindingCreateParameterSchemaExists =
      bindingCreateParameterSchema &&
      (bindingCreateParameterSchema.$ref ||
        bindingCreateParameterSchema.properties);

    const content = [
      <Fragment key={serviceInstance.name}>
        {/* <SchemaData
          data={schemaData}
          bindingCreateParameterSchema={bindingCreateParameterSchema}
          onSubmitSchemaForm={el => this.create(true)}
          planName={servicePlan.displayName}
          callback={this.callback}
        /> */}
      </Fragment>,
    ];

    if (serviceInstance.status.type !== 'RUNNING') {
      return (
        <StatusTooltip
          type="error"
          content={
            <span>
              Instance must be in a <strong>Running</strong> state
            </span>
          }
          minWidth="161px"
        >
          <Button compact option="light" disabled={true}>
            + Create Credentials
          </Button>
        </StatusTooltip>
      );
    }

    if (!bindingCreateParameterSchemaExists) {
      return (
        <Tooltip content={bindingVariables.serviceBinding}>
          <Button
            compact
            option="light"
            data-e2e-id={id}
            onClick={this.createWithoutOpening}
          >
            + Create Credentials
          </Button>
        </Tooltip>
      );
    }

    const createCredentialsButton = (
      <Tooltip content={bindingVariables.serviceBinding}>
        <Button
          compact
          option="light"
          data-e2e-id={id}
          onClick={this.handleOpen}
        >
          + Create Credentials
        </Button>
      </Tooltip>
    );

    return (
      <Modal
        ref={modal => {
          this.child = modal;
        }}
        key={serviceInstance.name}
        title="Create Credentials"
        confirmText="Create"
        onConfirm={this.handleConfirmation}
        modalOpeningComponent={createCredentialsButton}
        disabledConfirm={disabled}
        tooltipData={tooltipData}
        handleClose={this.clearState}
      >
        {content}
      </Modal>
    );
  }
}

export default function CreateCredentialsModalWithContext(props) {
  return WithNotificationContext(CreateCredentialsModal, props);
}
