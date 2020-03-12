import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes, getRefsValues } from 'react-shared';
import { Tab, TabGroup, FormLabel, FormSet } from 'fundamental-react';
import { useMutation } from '@apollo/react-hooks';

import TextFormItem from './../../Shared/TextFormItem';
import JSONEditor from './../../Shared/JSONEditor';
import CredentialsForm, {
  CREDENTIAL_TYPE_NONE,
} from 'components/Api/Forms/CredentialForms/CredentialsForm'; // TODO: Move to shared
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
    let credentials = null;
    if (oAuthValues && Object.keys(oAuthValues).length !== 0) {
      credentials = { credential: { oauth: oAuthValues } };
    }
    if (basicValues && Object.keys(basicValues).length !== 0) {
      credentials = { credential: { basic: basicValues } };
    }
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
