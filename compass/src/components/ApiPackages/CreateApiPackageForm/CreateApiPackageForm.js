import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormLabel } from 'fundamental-react';
import TextFormItem from './../../Shared/TextFormItem';
import JSONEditor from './../../Shared/JSONEditor';

import { useMutation } from '@apollo/react-hooks';
import { CREATE_API_PACKAGE } from './../gql';
import { GET_APPLICATION } from 'components/Application/gql';

CreateApiPackageForm.propTypes = {
  applicationId: PropTypes.string.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  onCompleted: PropTypes.func,
  setCustomValid: PropTypes.func,
};

export default function CreateApiPackageForm({
  applicationId,
  formElementRef,
  onChange,
  onCompleted,
  onError,
  setCustomValid,
}) {
  const [createApiPackage] = useMutation(CREATE_API_PACKAGE, {
    refetchQueries: () => [
      { query: GET_APPLICATION, variables: { id: applicationId } },
    ],
  });

  const name = React.useRef();
  const description = React.useRef();
  const [requestInputSchema, setRequestInputSchema] = React.useState({});

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
      await createApiPackage({
        variables: {
          applicationId,
          in: input,
        },
      });
      onCompleted(apiName, 'Package created successfully');
    } catch (error) {
      console.warn(error);
      onError('Cannot create Package');
    }
  };

  return (
    <form ref={formElementRef} onChange={onChange} onSubmit={handleFormSubmit}>
      <TextFormItem
        inputKey="name"
        required={true}
        label="Name"
        inputRef={name}
      />
      <TextFormItem
        inputKey="description"
        label="Description"
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
