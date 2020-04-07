import React from 'react';
import PropTypes from 'prop-types';

import { FormLabel, FormItem, Tab, TabGroup, FormSet } from 'fundamental-react';
import { JSONEditor, CustomPropTypes, CredentialsForm } from 'react-shared';
import {
  inferCredentialType,
  inferDefaultCredentials,
  getCredentialsRefsValue,
} from '../../ApiPackageHelpers';

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

  const credentials =
    apiPackage.defaultInstanceAuth && apiPackage.defaultInstanceAuth.credential;
  const [credentialsType, setCredentialsType] = React.useState(
    inferCredentialType(credentials),
  );

  const defaultCredentials = inferDefaultCredentials(
    credentialsType,
    credentials,
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
    const credentials = getCredentialsRefsValue(credentialRefs);
    const input = {
      name: apiName,
      description: description.current.value,
      instanceAuthRequestInputSchema: JSON.stringify(requestInputSchema),
      defaultInstanceAuth: credentials,
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
    <form
      ref={formElementRef}
      onChange={onChange}
      onSubmit={handleFormSubmit}
      style={{ minHeight: '440px' }}
    >
      <TabGroup>
        <Tab key="package-data" id="package-data" title="Data">
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
              defaultValues={defaultCredentials}
            />
          </FormSet>
        </Tab>
      </TabGroup>
    </form>
  );
}
