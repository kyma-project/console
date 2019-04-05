import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'styled-components-grid';
import equal from 'deep-equal';

import { Input, Select } from '@kyma-project/react-components';

import {
  getResourceDisplayName,
  randomNameGenerator,
} from '../../../commons/helpers';

class BasicData extends React.Component {
  static INSTANCE_NAME_MAX_LENGTH = 63;

  static propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    formData: PropTypes.object.isRequired,
    refetchInstanceExists: PropTypes.func.isRequired,
    serviceClass: PropTypes.object.isRequired,
    serviceClassExternalName: PropTypes.string.isRequired,
    serviceClassPlans: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      formData: this.props.formData,
      invalidInstanceName: false,
      instanceWithNameAlreadyExists: false,
      stepFilled: props.data.stepFilled,
      enableCheckNameExists: false,
    };
  }

  async componentWillMount() {
    const { serviceClass } = this.props;
    const { formData } = this.state;

    if (!serviceClass) return;

    let defaultInstanceName = '';
    while (true) {
      defaultInstanceName = `${
        serviceClass.externalName
      }-${randomNameGenerator()}`;

      this.setState({
        formData: {
          ...formData,
          name: defaultInstanceName,
          plan: serviceClass.plans[0].name,
        },
      });

      const { data, error } = await this.props.refetchInstanceExists(
        defaultInstanceName,
      );

      if (!error && !data.serviceInstance) break;
    }
  }

  componentDidMount() {
    clearTimeout(this.timer);
    const {
      formData,
      invalidInstanceName,
      instanceWithNameAlreadyExists,
    } = this.state;
    const stepFilled =
      formData.name && !invalidInstanceName && !instanceWithNameAlreadyExists;
    this.props.callback({
      stepFilled,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      formData,
      invalidInstanceName,
      instanceWithNameAlreadyExists,
      enableCheckNameExists,
    } = this.state;

    if (equal(this.state, prevState)) return;

    const stepFilled =
      formData.name && !invalidInstanceName && !instanceWithNameAlreadyExists;

    this.setState({
      stepFilled,
    });

    const tooltipData = !stepFilled
      ? {
          type: 'error',
          content: 'Fill out all mandatory fields',
        }
      : null;

    this.props.callback({
      formData,
      tooltipData,
      firstStepFilled: stepFilled,
    });

    clearTimeout(this.timer);
    if (
      enableCheckNameExists &&
      !invalidInstanceName &&
      formData &&
      formData.name &&
      typeof this.checkNameExists === 'function'
    ) {
      this.timer = setTimeout(() => {
        this.checkNameExists(formData.name);
      }, 250);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onChangeName = value => {
    this.setState({
      enableCheckNameExists: true,
      firstStepFilled: Boolean(value),
      instanceWithNameAlreadyExists: false,
      invalidInstanceName: this.validateInstanceName(value),
      formData: {
        ...this.state.formData,
        name: value,
      },
    });
  };

  onChangeLabels = value => {
    this.setState({
      formData: {
        ...this.state.formData,
        label: value,
      },
    });
  };

  onChangePlans = value => {
    this.setState({
      formData: {
        ...this.state.formData,
        plan: value,
      },
    });
  };

  checkNameExists = async name => {
    const { data, error } = await this.props.refetchInstanceExists(name);

    this.setState({
      instanceWithNameAlreadyExists:
        !error && data && data.serviceInstance !== null,
    });
  };

  invalidNameMessage = name => {
    if (!name.length) {
      return 'Please enter the name';
    }
    if (name[0] === '-' || name[name.length - 1] === '-') {
      return 'The instance name cannot begin or end with a dash';
    }
    if (name.length > 63) {
      return 'The maximum length of service name is 63 characters';
    }
    return 'The instance name can only contain lowercase alphanumeric characters or dashes';
  };

  validateInstanceName = name => {
    const format =
      /^[a-z0-9-]+$/.test(name) &&
      /[a-z0-9]/.test(name[0]) &&
      /[a-z0-9]/.test(name[name.length - 1]);

    const checkLength =
      name.length > BasicData.INSTANCE_NAME_MAX_LENGTH || !name.length;

    return !format || checkLength;
  };

  getInstanceNameErrorMessage = () => {
    const {
      invalidInstanceName,
      instanceWithNameAlreadyExists,
      formData,
    } = this.state;

    if (invalidInstanceName) {
      return this.invalidNameMessage(formData.name);
    }

    if (instanceWithNameAlreadyExists) {
      return `Instance with name "${formData.name}" already exists`;
    }

    return null;
  };

  render() {
    const { serviceClassPlans } = this.props;
    const {
      formData,
      invalidInstanceName,
      instanceWithNameAlreadyExists,
    } = this.state;

    const mappedPlans = serviceClassPlans.map((p, i) => (
      <option key={['plan', i].join('_')} value={p.name}>
        {getResourceDisplayName(p)}
      </option>
    ));

    return (
      <div>
        <Grid>
          <Grid.Unit size={0.49}>
            <Input
              label="Name"
              placeholder="Name of the Service Instance"
              value={formData.name}
              name="nameServiceInstances"
              handleChange={this.onChangeName}
              //onBlur={onBlur}
              isError={invalidInstanceName || instanceWithNameAlreadyExists}
              message={this.getInstanceNameErrorMessage()}
              required={true}
              type="text"
            />
          </Grid.Unit>
          <Grid.Unit size={0.02} />
          <Grid.Unit size={0.49}>
            <Select
              label="Plan"
              handleChange={this.onChangePlans}
              name="selectedKind"
              current={formData.plan}
              items={mappedPlans}
              required={true}
            />
          </Grid.Unit>
        </Grid>
        <Grid>
          <Grid.Unit size={1}>
            <Input
              label="Labels"
              type="text"
              placeholder="Separate labels with comma"
              value={formData.label}
              handleChange={this.onChangeLabels}
              name="nameServiceBindingUsage"
              noBottomMargin
              noMessageField
              marginTop={15}
            />
          </Grid.Unit>
        </Grid>
      </div>
    );
  }
}

export default BasicData;
