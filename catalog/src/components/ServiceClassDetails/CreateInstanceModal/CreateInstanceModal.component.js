import React from 'react';
import PropTypes from 'prop-types';
import dcopy from 'deep-copy';

import { ConfirmationModal, Separator } from '@kyma-project/react-components';

import BasicData from './BasicData.component';
import SchemaData from './SchemaData.component';

import { Bold } from './styled';

import builder from '../../../commons/builder';
import {
  clearEmptyPropertiesInObject,
  randomNameGenerator,
} from '../../../commons/helpers';

class CreateInstanceModal extends React.Component {
  static propTypes = {
    clusterServiceClass: PropTypes.object.isRequired,
    createServiceInstance: PropTypes.func.isRequired,
    instanceExists: PropTypes.object.isRequired,
    sendNotification: PropTypes.func.isRequired,
    modalOpeningComponent: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = this.getInitialState();
  }

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
    };
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  async componentDidMount() {
    const { clusterServiceClass } = this.props;

    if (!clusterServiceClass.clusterServiceClass) return;

    let defaultInstanceName = '';

    while (true) {
      defaultInstanceName = `${
        clusterServiceClass.clusterServiceClass.externalName
      }-${randomNameGenerator()}`;

      const { data, error } = await this.refetchInstanceExists(
        defaultInstanceName,
      );

      if (!error && !data.serviceInstance) break;
    }

    this.setState({
      formData: {
        ...this.state.formData,
        name: defaultInstanceName,
        plan:
          clusterServiceClass &&
          clusterServiceClass.clusterServiceClass &&
          clusterServiceClass.clusterServiceClass.plans[0].name,
      },
      firstStepFilled: true,
    });
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextState && nextState.tooltipData && nextState.tooltipData.show) {
      this.setState({
        tooltipData: null,
      });
    }
  }

  refetchInstanceExists = async name => {
    return await this.props.instanceExists.refetch({
      name,
      environment: builder.getCurrentEnvironmentId(),
    });
  };

  callback = data => {
    this.setState({ ...data });
  };

  handleConfirmation = () => {
    if (this.submitBtn) {
      this.submitBtn.click();
    } else {
      this.onSubmitSchemaForm();
    }
  };

  prepareDataToCreateServiceInstance = params => {
    const { clusterServiceClass } = this.props;
    const { formData } = this.state;

    const instanceName = formData.name;
    const currentPlan =
      clusterServiceClass.clusterServiceClass.plans.find(
        e => e.name === formData.plan,
      ) ||
      (clusterServiceClass.clusterServiceClass.plans.length &&
        clusterServiceClass.clusterServiceClass.plans[0]);
    const labels =
      formData.label === ''
        ? []
        : formData.label
            .replace(/\s+/g, '')
            .toLowerCase()
            .split(',');

    let instanceCreateParameters;
    if (params.formData) {
      instanceCreateParameters = dcopy(params.formData);
      clearEmptyPropertiesInObject(instanceCreateParameters);
    } else {
      instanceCreateParameters = {};
    }

    return {
      name: instanceName,
      environment: builder.getCurrentEnvironmentId(),
      externalServiceClassName:
        clusterServiceClass.clusterServiceClass.externalName,
      externalPlanName: currentPlan && currentPlan.externalName,
      classClusterWide: true, //TODO: Make ability to provision local service classes
      planClusterWide: true, //TODO: Make ability to provision local service classes
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
            title: `Instance "${variables.name}" created successfully`,
            color: '#359c46',
            icon: '\uE05B',
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
      this.child.child.setState({ showModal: false });
    }
  };

  render() {
    const { clusterServiceClass, modalOpeningComponent } = this.props;
    const {
      formData,
      firstStepFilled,
      tooltipData,
      creatingInstance,
      instanceCreateParameters,
    } = this.state;

    const externalName =
      (clusterServiceClass &&
        clusterServiceClass.clusterServiceClass &&
        clusterServiceClass.clusterServiceClass.externalName) ||
      '';
    const environment = builder.getCurrentEnvironmentId();

    const plans =
      (clusterServiceClass &&
        clusterServiceClass.clusterServiceClass &&
        clusterServiceClass.clusterServiceClass.plans) ||
      [];

    const schema = plans.find(e => e.name === formData.plan) || plans[0];

    const instanceCreateParameterSchema =
      (schema && schema.instanceCreateParameterSchema) || null;

    const disabled = !firstStepFilled;

    const firstStepData = {
      formData: formData,
      firstStepFilled: firstStepFilled,
    };

    const SecondStepData = {
      instanceCreateParameters: instanceCreateParameters,
    };

    const content = (
      <div>
        <BasicData
          data={firstStepData}
          clusterServiceClassExternalName={externalName}
          clusterServiceClassPlans={plans}
          refetchInstanceExists={this.refetchInstanceExists}
          formData={formData}
          clusterServiceClass={clusterServiceClass}
          callback={this.callback}
        />

        {!instanceCreateParameterSchema ||
        (instanceCreateParameterSchema &&
          !instanceCreateParameterSchema.properties) ? null : (
          <div>
            <Separator margin="16px -16px" />
            <SchemaData
              data={SecondStepData}
              instanceCreateParameterSchema={instanceCreateParameterSchema}
              onSubmitSchemaForm={this.onSubmitSchemaForm}
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
          </div>
        )}
      </div>
    );

    return (
      <ConfirmationModal
        ref={modal => {
          this.child = modal;
        }}
        title={
          <p style={{ marginRight: '25px' }}>
            Provision Service Class{' '}
            <Bold>{clusterServiceClass.clusterServiceClass.displayName}</Bold>{' '}
            in environment <Bold>{environment}</Bold>
          </p>
        }
        modalOpeningComponent={modalOpeningComponent}
        content={content}
        confirmText="Create Instance"
        cancelText="Cancel"
        tooltipData={tooltipData}
        disabled={disabled}
        handleConfirmation={this.handleConfirmation}
        handleClose={this.clearState}
        borderFooter={true}
        waiting={creatingInstance}
      />
    );
  }
}

export default CreateInstanceModal;
