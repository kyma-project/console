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
    onFormChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    children: PropTypes.element,
    instanceCreateParameterSchema: PropTypes.object,
    onSubmitSchemaForm: PropTypes.func.isRequired,
    planName: PropTypes.string,
    schemaFormRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleFormChange = ({ formData, errors }) => {
    this.props.onFormChange({
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
      schemaFormRef,
      data,
    } = this.props;

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
          schemaFormRef={schemaFormRef}
          schema={instanceCreateParameterSchema}
          additionalMetaSchemas={this.getAdditionalMetaSchemas(
            instanceCreateParameterSchema.$schema,
          )}
          onChange={this.handleFormChange}
          liveValidate={true}
          onSubmit={onSubmitSchemaForm}
          formData={data}
        >
          {children}
        </JsonSchemaForm>
      </ErrorBoundary>
    );
  }
}

export default SchemaData;
