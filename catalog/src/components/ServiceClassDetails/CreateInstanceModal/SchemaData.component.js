import React from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary.component';

import { JsonSchemaForm, Icon } from '@kyma-project/react-components';

class SchemaData extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    children: PropTypes.element,
    instanceCreateParameterSchema: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
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

    const schema =
      typeof instanceCreateParameterSchema === 'string'
        ? JSON.parse(JSON.stringify(instanceCreateParameterSchema))
        : instanceCreateParameterSchema;

    return (
      <ErrorBoundary
        content={
          <div>
            <Icon icon={'\uE1EC'} /> Incorrect schema
          </div>
        }
      >
        <JsonSchemaForm
          schema={schema}
          onChange={this.onChangeSchemaForm}
          liveValidate={true}
          onSubmit={onSubmitSchemaForm}
          formData={instanceCreateParameters}
        >
          {children}
        </JsonSchemaForm>
      </ErrorBoundary>
    );
  }
}

export default SchemaData;
