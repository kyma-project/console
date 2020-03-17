import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormLabel, FormItem } from 'fundamental-react';
import { JSONEditor } from 'react-shared';

import { useMutation } from '@apollo/react-hooks';
import { GET_API_PACKAGE } from 'gql/queries';
import { UPDATE_API_PACKAGE } from 'gql/mutations';
import { CompassGqlContext } from 'index';

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
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [updateApiPackage] = useMutation(UPDATE_API_PACKAGE, {
    client: compassGqlClient,
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
      <FormItem key="name">
        <FormLabel htmlFor="name" required={true}>
          Name
        </FormLabel>
        <input
          ref={name}
          required={true}
          id="name"
          type="text"
          placeholder="Name"
          autoComplete="off"
          defaultValue={apiPackage.name}
        />
      </FormItem>

      <FormItem key="description">
        <FormLabel htmlFor="description">Description</FormLabel>
        <input
          ref={description}
          id="description"
          type="text"
          placeholder="Description"
          autoComplete="off"
          defaultValue={apiPackage.description}
        />
      </FormItem>
      <FormLabel>Request input schema</FormLabel>
      <JSONEditor
        aria-label="schema-editor"
        onChangeText={handleSchemaChange}
        text={JSON.stringify(requestInputSchema, null, 2)}
      />
    </form>
  );
}
