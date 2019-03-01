import React, { Fragment } from 'react';

import { Button, Modal, Tooltip } from '@kyma-project/react-components';

import SchemaData from './SchemaData.component';
import { bindingVariables } from '../InfoButton/variables';
import InfoButton from '../InfoButton/InfoButton.component';

import { clearEmptyPropertiesInObject } from '../../../../commons/helpers';
import LuigiClient from '@kyma-project/luigi-client';

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
    const { serviceInstance, createBinding, sendNotification } = this.props;
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

      if (typeof sendNotification === 'function') {
        sendNotification({
          variables: {
            content: `Credentials "${createdBindingName}" created successfully`,
            title: `${createdBindingName}`,
            color: '#359c46',
            icon: 'accept',
            instanceName: createdBindingName,
          },
        });
      }
    } catch (e) {
      success = false;
      this.setState({
        tooltipData: {
          type: 'error',
          title: 'Error occored during creation',
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
      servicePlan,
    } = this.state;

    const { serviceInstance, id } = this.props;

    const disabled = !bindingCreateParameters;

    const schemaData = {
      bindingCreateParameters: bindingCreateParameters,
    };

    const bindingCreateParameterSchemaExists =
      bindingCreateParameterSchema &&
      (bindingCreateParameterSchema.$ref ||
        bindingCreateParameterSchema.properties);

    const content = [
      <Fragment key={serviceInstance.name}>
        <SchemaData
          data={schemaData}
          bindingCreateParameterSchema={bindingCreateParameterSchema}
          onSubmitSchemaForm={el => this.create(true)}
          planName={servicePlan.displayName}
          callback={this.callback}
        />
      </Fragment>,
    ];

    const createCredentialsButton = (
      <Button compact option="light" data-e2e-id={id} onClick={this.handleOpen}>
        + Create Credentials
      </Button>
    );

    if (serviceInstance.status.type !== 'RUNNING') {
      return (
        <Tooltip
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
        </Tooltip>
      );
    }

    if (!bindingCreateParameterSchemaExists) {
      return (
        <Button
          compact
          option="light"
          data-e2e-id={id}
          onClick={this.createWithoutOpening}
        >
          + Create Credentials
        </Button>
      );
    }

    const title = (
      <>
        <span>{'Bind Application'}</span>
        <InfoButton
          content={bindingVariables.serviceBinding}
          orientation="bottom"
        />
      </>
    );

    return (
      <Modal
        ref={modal => {
          this.child = modal;
        }}
        key={serviceInstance.name}
        title={title}
        confirmText="Create"
        onConfirm={this.handleConfirmation}
        modalOpeningComponent={createCredentialsButton}
        disabledConfirm={disabled}
        tooltipData={tooltipData}
        handleClose={this.clearState}
        onShow={() => LuigiClient.uxManager().addBackdrop()}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {content}
      </Modal>
    );
  }
}

export default CreateCredentialsModal;
