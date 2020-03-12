import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { CustomPropTypes, getRefsValues } from 'react-shared';
import { FormLabel, Tab, TabGroup, FormSet } from 'fundamental-react';

import CredentialsForm, {
  CREDENTIAL_TYPE_NONE,
} from 'components/Api/Forms/CredentialForms/CredentialsForm'; // TODO: Move to shared
import { CREDENTIAL_TYPE_OAUTH } from 'components/Api/Forms/CredentialForms/OAuthCredentialsForm';
import TextFormItem from '../../../Shared/TextFormItem';
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
  };
  const [requestInputSchema, setRequestInputSchema] = React.useState(
    JSON.parse(apiPackage.instanceAuthRequestInputSchema || '{}'),
  );
  const [credentialsType, setCredentialsType] = React.useState(
    apiPackage.defaultInstanceAuth && apiPackage.defaultInstanceAuth.credential
      ? CREDENTIAL_TYPE_OAUTH
      : CREDENTIAL_TYPE_NONE,
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
    const oAuthValues = getRefsValues(credentialRefs.oAuth);
    let credentials = null;
    if (oAuthValues && Object.keys(oAuthValues).length !== 0) {
      credentials = { credential: { oauth: oAuthValues } };
    }
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

  const defaultCredentials =
    apiPackage.defaultInstanceAuth && apiPackage.defaultInstanceAuth.credential
      ? {
          oAuth: {
            ...(apiPackage.defaultInstanceAuth &&
              apiPackage.defaultInstanceAuth.credential),
          },
        }
      : null;

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
