import React from 'react';
import PropTypes from 'prop-types';

import { JsonSchemaForm, ErrorBoundary, Icon } from '@kyma-project/react-components';
import { Bold } from './styled';

class SchemaData extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    children: PropTypes.element,
    instanceCreateParameterSchema: PropTypes.object,
    onSubmitSchemaForm: PropTypes.func.isRequired,
    planName: PropTypes.string,
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
      planName,
    } = this.props;
    const { instanceCreateParameters } = this.state;

    return (
      <ErrorBoundary
        content={
          <div>
            <Icon icon={'\uE1EC'} /> Incorrect Instance Create Parameter schema in <Bold>{planName}</Bold> plan
          </div>
        }
      >
        <JsonSchemaForm
          schema={instanceCreateParameterSchema}
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
