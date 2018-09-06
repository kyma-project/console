import React from 'react';
import PropTypes from 'prop-types';

import { JsonSchemaForm } from '@kyma-project/react-components';

class SchemaData extends React.Component {
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

export default SchemaData;
