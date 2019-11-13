import React from 'react';
import PropTypes from 'prop-types';

import {
  JsonSchemaForm,
  ErrorBoundary,
  Icon,
} from '@kyma-project/react-components';
import { Bold, Flex } from './styled';
const [draft04, draft06] = [
  require('ajv/lib/refs/json-schema-draft-04.json'),
  require('ajv/lib/refs/json-schema-draft-06.json'),
];

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
      errors: [],
      instanceCreateParameters: props.data.instanceCreateParameters,
    };
  }

  onChangeSchemaForm = ({ formData, errors }) => {
    this.setState({
      instanceCreateParameters: formData,
    });
    this.props.callback({
      errors,
      instanceCreateParameters: formData,
    });
  };

  getAdditionalMetaSchemas = currentSchema => {
    let additionalSchemaArray = [];
    if (currentSchema) {
      currentSchema.includes('draft-04') && additionalSchemaArray.push(draft04);
      currentSchema.includes('draft-06') && additionalSchemaArray.push(draft06);
    }
    return additionalSchemaArray;
  };

  render() {
    const {
      instanceCreateParameterSchema,
      onSubmitSchemaForm,
      children,
      planName,
      formRef,
    } = this.props;
    const { instanceCreateParameters } = this.state;

    return (
      <ErrorBoundary
        content={
          <Flex>
            <Icon glyph="error" style={{ padding: '0 5px 0 0' }} /> Incorrect
            Instance Create Parameter schema in <Bold>{planName}</Bold> plan
          </Flex>
        }
      >
        <JsonSchemaForm
          formRef={formRef}
          schema={instanceCreateParameterSchema}
          additionalMetaSchemas={this.getAdditionalMetaSchemas(
            instanceCreateParameterSchema.$schema,
          )}
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
