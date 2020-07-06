import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { CustomPropTypes, TextFormItem, CredentialsForm } from 'react-shared';
import { FormLabel, Tab, TabGroup, FormSet } from 'fundamental-react';

import {
  inferCredentialType,
  inferDefaultCredentials,
  getCredentialsRefsValue,
} from '../../ApiPackagesHelpers';
import JSONEditor from '../../../Shared/JSONEditor';
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
  const credentialRefs = {
    oAuth: {
      clientId: React.useRef(null),
      clientSecret: React.useRef(null),
      url: React.useRef(null),
    },
    basic: {
      username: React.useRef(null),
      password: React.useRef(null),
    },
  };
  const [requestInputSchema, setRequestInputSchema] = React.useState(
    JSON.parse(apiPackage.instanceAuthRequestInputSchema || '{}'),
  );

  const [credentialsType, setCredentialsType] = React.useState(
    inferCredentialType(apiPackage.defaultInstanceAuth),
  );
  const defaultCredentials = inferDefaultCredentials(
    credentialsType,
    apiPackage.defaultInstanceAuth,
  );

  const handleSchemaChange = schema => {
    const isNonNullObject = o => typeof o === 'object' && !!o;
    try {
      const parsedSchema = JSON.parse(schema);
      setRequestInputSchema(parsedSchema);
      setCustomValid(isNonNullObject(parsedSchema));
    } catch (e) {
      setCustomValid(false);
    }
  };

  const handleFormSubmit = async () => {
    const apiName = name.current.value;
    const creds = getCredentialsRefsValue(credentialRefs, credentialsType);
    const input = {
      name: apiName,
      description: description.current.value,
      instanceAuthRequestInputSchema: JSON.stringify(requestInputSchema),
      defaultInstanceAuth: creds,
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
      console.warn(error.message);
      onError('Cannot update API Package', error.message);
    }
  };

  return (
    <form ref={formElementRef} onChange={onChange} onSubmit={handleFormSubmit}>
      <TabGroup>
        <Tab key="package-data" id="package-data" title="Data">
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
        </Tab>
        <Tab
          key="package-credentials"
          id="package-credentials"
          title="Default credentials"
        >
          <FormSet>
            <CredentialsForm
              credentialRefs={credentialRefs}
              credentialType={credentialsType}
              setCredentialType={setCredentialsType}
              defaultValues={defaultCredentials}
            />
          </FormSet>
        </Tab>
      </TabGroup>
    </form>
  );
}
