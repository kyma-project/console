import React, { Fragment } from 'react';
import dcopy from 'deep-copy';

import { ConfirmationModal, Tooltip } from '@kyma-project/react-components';

import SchemaData from './SchemaData.component';

import { CreateCredentialsButton } from './styled';

import {
  clearEmptyPropertiesInObject,
  randomNameGenerator,
} from '../../../../commons/helpers';

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
      nameServiceBinding:
        this.props.serviceInstance.name + '-binding-' + randomNameGenerator(),
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

  create = async params => {
    const { nameServiceBinding } = this.state;
    const {
      serviceInstance,
      createBinding,
      serviceInstanceRefetch,
      sendNotification,
    } = this.props;

    try {
      let bindingCreateParameters;
      if (params && params.formData) {
        bindingCreateParameters = dcopy(params.formData);
        clearEmptyPropertiesInObject(bindingCreateParameters);
      } else {
        bindingCreateParameters = {};
      }
      await createBinding(
        nameServiceBinding,
        serviceInstance.name,
        bindingCreateParameters,
      );

      this.child.child.handleCloseModal();
      if (typeof sendNotification === 'function') {
        sendNotification({
          variables: {
            title: `Credentials "${nameServiceBinding}" created successfully`,
            color: '#359c46',
            icon: '\uE05B',
            instanceName: nameServiceBinding,
          },
        });
      }
      setTimeout(() => {
        if (typeof serviceInstanceRefetch === 'function') {
          serviceInstanceRefetch();
        }
      }, 1000);
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
      this.create();
    }
  };

  handleOpen = () => {
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
    } = this.state;

    const { serviceInstance, id } = this.props;

    const disabled = !bindingCreateParameters;

    const schemaData = {
      bindingCreateParameters: bindingCreateParameters,
    };

    const bindingDescription =
      'To use ServiceInstance, you need credentials for this service. To obtain credentials, proceed with this form. One instance can have numerous credentials to use in the Deployment or Function. When you raise a credentials request, the system returns the credentials in the form of a Secret. The system creates a Secret in a given Environment.';

    const content = [
      <Fragment key={serviceInstance.name}>
        {bindingCreateParameterSchema &&
          bindingCreateParameterSchema &&
          bindingCreateParameterSchema.properties && (
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
        headerAdditionalInfo={bindingDescription}
      />
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
