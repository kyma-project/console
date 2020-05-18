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

const SchemaData = ({
  onFormChange,
  onSubmitSchemaForm,
  data,
  children,
  instanceCreateParameterSchema,
  planName,
  schemaFormRef,
  validationVisible,
}) => {
  const handleFormChange = ({ formData, errors }) => {
    onFormChange({
      instanceCreateParameters: formData,
    });
  };

  const getAdditionalMetaSchemas = currentSchema => {
    let additionalSchemaArray = [];
    if (currentSchema) {
      currentSchema.includes('draft-04') && additionalSchemaArray.push(draft04);
      currentSchema.includes('draft-06') && additionalSchemaArray.push(draft06);
    }
    return additionalSchemaArray;
  };

  const removeErrorMessages = errors =>
    errors.map(e => {
      e.message = '';
      return e;
    });

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
        additionalMetaSchemas={getAdditionalMetaSchemas(
          instanceCreateParameterSchema.$schema,
        )}
        onChange={handleFormChange}
        liveValidate={true}
        onSubmit={onSubmitSchemaForm}
        formData={data}
        transformErrors={validationVisible ? undefined : removeErrorMessages}
      >
        {children}
      </JsonSchemaForm>
    </ErrorBoundary>
  );
};

SchemaData.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  children: PropTypes.element,
  instanceCreateParameterSchema: PropTypes.object,
  onSubmitSchemaForm: PropTypes.func.isRequired,
  planName: PropTypes.string,
  schemaFormRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};

export default SchemaData;
