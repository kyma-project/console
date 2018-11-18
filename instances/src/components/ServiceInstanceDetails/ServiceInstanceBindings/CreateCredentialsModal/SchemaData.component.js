import React from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary.component';

import { JsonSchemaForm, Icon } from '@kyma-project/react-components';

class SchemaData extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    children: PropTypes.element,
    bindingCreateParameterSchema: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    onSubmitSchemaForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bindingCreateParameters: props.data.bindingCreateParameters,
    };
  }

  onChangeSchemaForm = ({ formData }) => {
    this.setState({
      bindingCreateParameters: formData,
    });
    this.props.callback({
      bindingCreateParameters: formData,
    });
  };

  render() {
    const {
      bindingCreateParameterSchema,
      onSubmitSchemaForm,
      children,
    } = this.props;
    const { bindingCreateParameters } = this.state;

    const schema =
      typeof bindingCreateParameterSchema === 'string'
        ? JSON.parse(JSON.stringify(bindingCreateParameterSchema))
        : bindingCreateParameterSchema;

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
          formData={bindingCreateParameters}
        >
          {children}
        </JsonSchemaForm>
      </ErrorBoundary>
    );
  }
}

export default SchemaData;
