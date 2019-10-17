import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Separator, Modal } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import BasicData from './BasicData.component';
import SchemaData from './SchemaData.component';

import { Bold } from './styled';

import builder from '../../../commons/builder';
import { clearEmptyPropertiesInObject } from '../../../commons/helpers';

class CreateInstanceModal extends Component {
  static propTypes = {
    serviceClass: PropTypes.object.isRequired,
    createServiceInstance: PropTypes.func.isRequired,
    instanceExists: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    modalOpeningComponent: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    const { serviceClass } = props;

    const plans = (serviceClass && serviceClass.plans) || [];
    plans.forEach(plan => {
      this.parseDefaultIntegerValues(plan);
    });
  }

  parseDefaultIntegerValues = plan => {
    const schema = (plan && plan.instanceCreateParameterSchema) || null;
    if (schema && schema.properties) {
      const schemaProps = schema.properties;
      Object.keys(schemaProps).forEach(key => {
        if (
          schemaProps[key].default !== undefined &&
          schemaProps[key].type === 'integer'
        ) {
          schemaProps[key].default = Number(schemaProps[key].default);
        }
      });
    }
  };

  getInitialState = () => {
    return {
      formData: {
        name: '',
        label: '',
        plan: {},
      },
      firstStepFilled: false,
      creatingInstance: false,
      instanceCreateParameters: {},
      tooltipData: {},
      errors: [],
      serviceClass: this.props.serviceClass,
    };
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  prepareFormData = () => {
    const { serviceClass } = this.props;

    if (!serviceClass) return;

    const planName =
      serviceClass &&
      serviceClass.plans &&
      serviceClass.plans[0] &&
      serviceClass.plans[0].name;
    this.setState({
      formData: {
        ...this.state.formData,
        name: '',
        plan: planName,
      },
    });
  };

  componentDidUpdate(nextProps, nextState) {
    if (nextState && nextState.tooltipData && nextState.tooltipData.show) {
      this.setState({
        tooltipData: null,
      });
    }
  }

  refetchInstanceExists = async name => {
    return await this.props.instanceExists(name);
  };

  onShow = () => {
    this.prepareFormData();
    LuigiClient.uxManager().addBackdrop();
  };

  onHide = () => {
    LuigiClient.uxManager().removeBackdrop();
  };

  callback = data => {
    this.setState({ ...data });
  };

  handleConfirmation = () => {
    this.onSubmitSchemaForm();
  };

  prepareDataToCreateServiceInstance = params => {
    const { serviceClass } = this.props;
    const { formData, instanceCreateParameters } = this.state;

    const instanceName = formData.name;
    const currentPlan =
      serviceClass.plans.find(e => e.name === formData.plan) ||
      (serviceClass.plans.length && serviceClass.plans[0]);
    const labels =
      formData.label === ''
        ? []
        : formData.label
            .replace(/\s+/g, '')
            .toLowerCase()
            .split(',');

    clearEmptyPropertiesInObject(instanceCreateParameters);

    const isClusterServiceClass =
      serviceClass.__typename === 'ClusterServiceClass';

    return {
      name: instanceName,
      namespace: builder.getCurrentEnvironmentId(),
      externalServiceClassName: serviceClass.externalName,
      externalPlanName: currentPlan && currentPlan.externalName,
      classClusterWide: isClusterServiceClass,
      planClusterWide: isClusterServiceClass,
      labels,
      parameterSchema: instanceCreateParameters,
    };
  };

  onSubmitSchemaForm = async (params = {}) => {
    const errors = params.errors;

    if (errors && errors.length > 0) {
      this.setState({
        tooltipData: {
          type: 'error',
          title: 'Form is not valid',
          content: errors.join(', '),
          show: true,
          minWidth: '261px',
        },
      });
      return;
    }

    const { createServiceInstance, sendNotification } = this.props;
    const variables = this.prepareDataToCreateServiceInstance(params);

    let success = true;
    this.setState({
      creatingInstance: true,
    });
    try {
      if (typeof createServiceInstance === 'function') {
        await createServiceInstance({
          variables,
        });
      }
      if (typeof sendNotification === 'function') {
        sendNotification({
          variables: {
            type: 'success',
            title: `Instance "${variables.name}" created successfully`,
            color: '#359c46',
            icon: 'accept',
            instanceName: variables.name,
          },
        });
      }
    } catch (err) {
      success = false;
      this.setState({
        tooltipData: {
          type: 'error',
          content: "Couldn't create an instance",
          show: true,
          minWidth: '261px',
        },
      });
    }

    this.setState({
      creatingInstance: true,
    });
    if (success) {
      this.clearState();
      LuigiClient.uxManager().removeBackdrop();
    }
  };

  render() {
    const { modalOpeningComponent } = this.props;
    const {
      serviceClass,
      formData,
      firstStepFilled,
      creatingInstance,
      tooltipData,
      instanceCreateParameters,
      errors,
    } = this.state;

    const externalName = (serviceClass && serviceClass.externalName) || '';
    const environment = builder.getCurrentEnvironmentId();

    const plans = (serviceClass && serviceClass.plans) || [];

    const schema = plans.find(e => e.name === formData.plan) || plans[0];

    const instanceCreateParameterSchema =
      (schema && schema.instanceCreateParameterSchema) || {};

    const instanceCreateParameterSchemaExists =
      instanceCreateParameterSchema &&
      (instanceCreateParameterSchema.$ref ||
        instanceCreateParameterSchema.properties);

    const disabled =
      !firstStepFilled ||
      (instanceCreateParameterSchemaExists && errors.length > 0);

    const firstStepData = {
      formData: formData,
      firstStepFilled: firstStepFilled,
    };

    const SecondStepData = {
      instanceCreateParameters: instanceCreateParameters,
    };

    const content = (
      <Fragment>
        <BasicData
          data={firstStepData}
          serviceClassExternalName={externalName}
          serviceClassPlans={plans}
          refetchInstanceExists={this.refetchInstanceExists}
          formData={formData}
          serviceClass={serviceClass}
          callback={this.callback}
        />
        {instanceCreateParameterSchemaExists && (
          <Fragment>
            <Separator margin="16px -16px" />
            <SchemaData
              data={SecondStepData}
              instanceCreateParameterSchema={instanceCreateParameterSchema}
              onSubmitSchemaForm={this.onSubmitSchemaForm}
              planName={schema.displayName}
              callback={this.callback}
            />
          </Fragment>
        )}
      </Fragment>
    );

    return (
      <Modal
        width={'681px'}
        title={
          <p style={{ marginRight: '25px' }}>
            Provision the <Bold>{serviceClass.displayName}</Bold>{' '}
            {serviceClass.__typename === 'ClusterServiceClass'
              ? 'Cluster Service Class'
              : 'Service Class'}{' '}
            in the <Bold>{environment}</Bold> Namespace
          </p>
        }
        type={'emphasized'}
        modalOpeningComponent={modalOpeningComponent}
        confirmText="Create Instance"
        cancelText="Cancel"
        tooltipData={tooltipData}
        disabledConfirm={disabled}
        onConfirm={this.handleConfirmation}
        waiting={creatingInstance}
        onShow={this.onShow}
        onHide={() => {
          this.clearState();
          this.onHide();
        }}
      >
        {content}
      </Modal>
    );
  }
}

export default CreateInstanceModal;
