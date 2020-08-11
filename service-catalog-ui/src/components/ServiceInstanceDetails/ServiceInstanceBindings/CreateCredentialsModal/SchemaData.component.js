import React from 'react';
import PropTypes from 'prop-types';

import {
  JsonSchemaForm,
  Icon,
  ErrorBoundary,
} from '@kyma-project/react-components';
import { Bold } from './styled';

class SchemaData extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    children: PropTypes.element,
    bindingCreateParameterSchema: PropTypes.object,
    onSubmitSchemaForm: PropTypes.func.isRequired,
    planName: PropTypes.string,
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
      planName,
    } = this.props;
    const { bindingCreateParameters } = this.state;

    return (
      <ErrorBoundary
        content={
          <div>
            <Icon glyph="error" style={{ padding: '0 5px 0 0' }} /> Incorrect
            Binding Create Parameter schema in <Bold>{planName}</Bold> plan
          </div>
        }
      >
        <JsonSchemaForm
          schema={bindingCreateParameterSchema}
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
