import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes, getRefsValues, FileInput } from 'react-shared';
import {
  TabGroup,
  Tab,
  FormSet,
  FormItem,
  FormLabel,
  FormSelect,
} from 'fundamental-react';
import CredentialsForm, {
  CREDENTIAL_TYPE_NONE,
} from '../Forms/CredentialForms/CredentialsForm';

import { createApiData, verifyApiFile } from '../ApiHelpers';

import ApiForm from '../Forms/ApiForm';
import { useMutation } from 'react-apollo';
import { ADD_API_DEFINITION } from 'gql/mutations';
import { CompassGqlContext } from 'index';
import { GET_APPLICATION_COMPASS } from 'gql/queries';

CreateApiForm.propTypes = {
  applicationId: PropTypes.string.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

export default function CreateApiForm({
  applicationId,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [addApi] = useMutation(ADD_API_DEFINITION, {
    client: compassGqlClient,
    refetchQueries: () => [
      { query: GET_APPLICATION_COMPASS, variables: { id: applicationId } },
    ],
  });

  const [specProvided, setSpecProvided] = React.useState(false);

  const [credentialsType, setCredentialsType] = React.useState(
    CREDENTIAL_TYPE_NONE,
  );

  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
    group: React.useRef(null),
    targetURL: React.useRef(null),
  };

  const fileRef = React.useRef(null);
  const apiTypeRef = React.useRef(null);

  const [spec, setSpec] = React.useState({
    data: '',
    format: null,
  });

  const credentialRefs = {
    oAuth: {
      clientId: React.useRef(null),
      clientSecret: React.useRef(null),
      url: React.useRef(null),
    },
  };

  const verifyFile = async file => {
    const form = formElementRef.current;
    const input = fileRef.current;
    input.setCustomValidity('');
    if (!file) {
      return;
    }

    const expectedType = apiTypeRef.current.value;
    const { data, format, error } = await verifyApiFile(file, expectedType);
    if (error) {
      input.setCustomValidity(error);
      form.reportValidity();
    } else {
      setSpec({ data, format });

      onChange(formElementRef.current);
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    const basicApiData = getRefsValues(formValues);
    const credentials = { oAuth: getRefsValues(credentialRefs.oAuth) };
    const specData = specProvided
      ? { ...spec, type: apiTypeRef.current.value }
      : null;

    const apiData = createApiData(
      basicApiData,
      specData,
      credentials,
      credentialsType,
    );

    try {
      await addApi({
        variables: {
          applicationId,
          in: apiData,
        },
      });
      onCompleted(basicApiData.name, 'API Definition created successfully');
    } catch (error) {
      console.warn(error);
      onError('Cannot create API Definition');
    }
  };

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      onSubmit={handleFormSubmit}
      style={{ height: '600px', width: '400px' }}
    >
      <TabGroup>
        <Tab key="api-data" id="api-data" title="API data">
          <FormSet>
            <ApiForm formValues={formValues} />
            <p
              className="link fd-has-margin-bottom-s clear-underline"
              onClick={() => setSpecProvided(!specProvided)}
            >
              {specProvided ? 'Remove specification' : 'Add specification'}
            </p>
            {specProvided && (
              <>
                <FormItem>
                  <FormLabel htmlFor="api-type">Type</FormLabel>
                  <FormSelect
                    id="api-type"
                    ref={apiTypeRef}
                    defaultValue="OPEN_API"
                  >
                    <option value="OPEN_API">Open API</option>
                    <option value="ODATA">OData</option>
                  </FormSelect>
                </FormItem>
                <FormItem>
                  <FileInput
                    inputRef={fileRef}
                    fileInputChanged={verifyFile}
                    availableFormatsMessage={
                      'Available file types: JSON, YAML, XML'
                    }
                    required
                    acceptedFileFormats=".yml,.yaml,.json,.xml"
                  />
                </FormItem>
              </>
            )}
          </FormSet>
        </Tab>
        <Tab key="credentials" id="credentials" title="Credentials">
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
