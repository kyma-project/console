import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormLabel } from 'fundamental-react';
import TextFormItem from '../../../Shared/TextFormItem';
import JSONEditor from '../../../Shared/JSONEditor';

import { useMutation } from '@apollo/react-hooks';
import { UPDATE_API_PACKAGE, GET_API_PACKAGE } from './../../gql';

EditApiPackageForm.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackage: PropTypes.object.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  setCustomValid: PropTypes.func.isRequired,
};

export default function EditApiPackageForm({
  applicationId,
  apiPackage,
  formElementRef,
  onChange,
  onCompleted,
  onError,
  setCustomValid,
}) {
  const [updateApiPackage] = useMutation(UPDATE_API_PACKAGE, {
    refetchQueries: () => [
      {
        query: GET_API_PACKAGE,
        variables: { applicationId, apiPackageId: apiPackage.id },
      },
    ],
  });

  const name = React.useRef();
  const description = React.useRef();
  const [requestInputSchema, setRequestInputSchema] = React.useState(
    JSON.parse(apiPackage.instanceAuthRequestInputSchema || '{}'),
  );

  const handleSchemaChange = schema => {
    try {
      setRequestInputSchema(JSON.parse(schema));
      setCustomValid(true);
    } catch (e) {
      setCustomValid(false);
    }
  };

  const handleFormSubmit = async () => {
    const apiName = name.current.value;
    const input = {
      name: apiName,
      description: description.current.value,
      instanceAuthRequestInputSchema: JSON.stringify(requestInputSchema),
    };
    try {
      await updateApiPackage({
        variables: {
          id: apiPackage.id,
          in: input,
        },
      });
      onCompleted(apiName, 'API Package update successfully');
    } catch (error) {
      console.warn(error);
      onError('Cannot update API Package');
    }
  };

  return (
    <form ref={formElementRef} onChange={onChange} onSubmit={handleFormSubmit}>
      <TextFormItem
        inputKey="name"
        required={true}
        label="Name"
        defaultValue={apiPackage.name}
        inputRef={name}
      />
      <TextFormItem
        inputKey="description"
        label="Description"
        defaultValue={apiPackage.description}
        inputRef={description}
      />
      <FormLabel>Request input schema</FormLabel>
      <JSONEditor
        aria-label="schema-editor"
        onChangeText={handleSchemaChange}
        text={JSON.stringify(requestInputSchema, null, 2)}
      />
    </form>
  );
}
