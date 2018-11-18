import React, { Fragment } from 'react';
import dcopy from 'deep-copy';

import { ConfirmationModal, Tooltip } from '@kyma-project/react-components';

import SchemaData from './SchemaData.component';
import { bindingVariables } from '../InfoButton/variables';

import { CreateCredentialsButton } from './styled';

import { clearEmptyPropertiesInObject } from '../../../../commons/helpers';

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

  create = async (params, isOpenedModal) => {
    const { serviceInstance, createBinding, sendNotification } = this.props;

    try {
      let bindingCreateParameters;
      if (params && params.formData) {
        bindingCreateParameters = dcopy(params.formData);
        clearEmptyPropertiesInObject(bindingCreateParameters);
      } else {
        bindingCreateParameters = {};
      }
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
            icon: '\uE05B',
            instanceName: createdBindingName,
          },
        });
      }
    } catch (e) {
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
  };

  handleConfirmation = () => {
    if (this.submitBtn) {
      this.submitBtn.click();
    } else {
      this.create(null, true);
    }
  };

  handleOpen = () => {
    const { bindingCreateParameterSchema } = this.state;
    if (!bindingCreateParameterSchema) {
      this.create(null, true);
    }
  };
  createWithoutOpening = () => {
    const { bindingCreateParameterSchema } = this.state;
    if (!bindingCreateParameterSchema) {
      this.create(null);
    }
  };

  render() {
    const {
      bindingCreateParameters,
      tooltipData,
      bindingCreateParameterSchema,
    } = this.state;

    const { serviceInstance, id } = this.props;

    const disabled = !bindingCreateParameters;

    const schemaData = {
      bindingCreateParameters: bindingCreateParameters,
    };

    const content = [
      <Fragment key={serviceInstance.name}>
        {bindingCreateParameterSchema && (
          <SchemaData
            data={schemaData}
            bindingCreateParameterSchema={bindingCreateParameterSchema}
            onSubmitSchemaForm={this.create}
            callback={this.callback}
          >
            {/* Styled components don't work here */}
            <button
              className="hidden"
              type="submit"
              ref={submitBtn => (this.submitBtn = submitBtn)}
            >
              Submit
            </button>
          </SchemaData>
        )}
      </Fragment>,
    ];

    const createCredentialsButton = (
      <CreateCredentialsButton data-e2e-id={id} onClick={this.handleOpen}>
        + Create Credentials
      </CreateCredentialsButton>
    );

    return serviceInstance.status.type === 'RUNNING' ? (
      <Fragment>
        {bindingCreateParameterSchema ? (
          <ConfirmationModal
            ref={modal => {
              this.child = modal;
            }}
            key={serviceInstance.name}
            title={'Bind Application'}
            confirmText="Create"
            cancelText="Cancel"
            content={content}
            handleConfirmation={this.handleConfirmation}
            modalOpeningComponent={createCredentialsButton}
            disabled={disabled}
            tooltipData={tooltipData}
            borderFooter={true}
            handleClose={this.clearState}
            headerAdditionalInfo={bindingVariables.serviceBinding}
          />
        ) : (
          <CreateCredentialsButton
            data-e2e-id={id}
            onClick={this.createWithoutOpening}
          >
            + Create Credentials
          </CreateCredentialsButton>
        )}
      </Fragment>
    ) : (
      <Tooltip
        type="error"
        content={
          <span>
            Instance must be in a <strong>Running</strong> state
          </span>
        }
        minWidth="161px"
      >
        <CreateCredentialsButton disabled={true}>
          + Create Credentials
        </CreateCredentialsButton>
      </Tooltip>
    );
  }
}

export default CreateCredentialsModal;
