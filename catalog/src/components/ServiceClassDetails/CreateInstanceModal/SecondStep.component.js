import React from 'react';
import PropTypes from 'prop-types';

import { JsonSchemaForm } from '@kyma-project/react-components';

import { NoFormText } from './styled';

class SecondStep extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    children: PropTypes.element,
    instanceCreateParameterSchema: PropTypes.object,
    onSubmitSchemaForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      instanceCreateParameters: props.data.instanceCreateParameters,
    };
  }

  onChangeSchemaForm = ({ formData }) => {
    this.setState({
      instanceCreateParameters: formData,
    });
    this.props.callback({
      instanceCreateParameters: formData,
    });
  };

  render() {
    const {
      instanceCreateParameterSchema,
      onSubmitSchemaForm,
      children,
    } = this.props;
    const { instanceCreateParameters } = this.state;

    if (
      !instanceCreateParameterSchema ||
      (instanceCreateParameterSchema &&
        !instanceCreateParameterSchema.properties)
    ) {
      return (
        <NoFormText>
          No further configuration for selected Service Plan is needed. You can
          submit the form and create the service instance.
        </NoFormText>
      );
    }

    return (
      <JsonSchemaForm
        schema={instanceCreateParameterSchema}
        onChange={this.onChangeSchemaForm}
        liveValidate={true}
        onSubmit={onSubmitSchemaForm}
        formData={instanceCreateParameters}
      >
        {children}
      </JsonSchemaForm>
    );
  }
}

export default SecondStep;
