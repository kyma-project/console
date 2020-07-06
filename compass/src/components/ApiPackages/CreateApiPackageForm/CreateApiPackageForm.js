import React from 'react';
import PropTypes from 'prop-types';
import {
  CustomPropTypes,
  TextFormItem,
  CredentialsForm,
  CREDENTIAL_TYPE_NONE,
} from 'react-shared';
import { Tab, TabGroup, FormLabel, FormSet } from 'fundamental-react';
import { useMutation } from '@apollo/react-hooks';

import JSONEditor from './../../Shared/JSONEditor';
import { CREATE_API_PACKAGE } from './../gql';
import { GET_APPLICATION } from 'components/Application/gql';
import { getCredentialsRefsValue } from '../ApiPackagesHelpers';

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
  const [requestInputSchema, setRequestInputSchema] = React.useState({});
  const [credentialsType, setCredentialsType] = React.useState(
    CREDENTIAL_TYPE_NONE,
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
    const credentials = getCredentialsRefsValue(
      credentialRefs,
      credentialsType,
    );
    const input = {
      name: apiName,
      description: description.current.value,
      instanceAuthRequestInputSchema: JSON.stringify(requestInputSchema),
      defaultInstanceAuth: credentials,
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
      <TabGroup>
        <Tab key="package-data" id="package-data" title="Data">
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
        </Tab>
        <Tab
          key="package-credentials"
          id="package-credentials"
          title="Credentials"
        >
          <FormSet>
            <CredentialsForm
              credentialRefs={credentialRefs}
              credentialType={credentialsType}
              setCredentialType={setCredentialsType}
            />
          </FormSet>
        </Tab>
      </TabGroup>
    </form>
  );
}
