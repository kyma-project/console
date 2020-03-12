import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { CustomPropTypes, getRefsValues } from 'react-shared';
import { FormLabel, Tab, TabGroup, FormSet } from 'fundamental-react';

import CredentialsForm, {
  CREDENTIAL_TYPE_NONE,
} from 'components/Api/Forms/CredentialForms/CredentialsForm'; // TODO: Move to shared
import { CREDENTIAL_TYPE_OAUTH } from 'components/Api/Forms/CredentialForms/OAuthCredentialsForm';
import { CREDENTIAL_TYPE_BASIC } from 'components/Api/Forms/CredentialForms/BasicCredentialsForm';
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
    credentials
      ? credentials.url
        ? CREDENTIAL_TYPE_OAUTH
        : CREDENTIAL_TYPE_BASIC
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
    const basicValues = getRefsValues(credentialRefs.basic);
    let creds = null;
    if (oAuthValues && Object.keys(oAuthValues).length !== 0) {
      creds = { credential: { oauth: oAuthValues } };
    } else if (basicValues && Object.keys(basicValues).length !== 0) {
      creds = { credential: { basic: basicValues } };
    }
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

  const defaultCredentials = credentials
    ? credentials.url
      ? {
          oAuth: {
            ...credentials,
          },
        }
      : {
          basic: {
            ...credentials,
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
