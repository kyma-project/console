import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import { TabGroup, Tab, FormSet, FormItem } from 'fundamental-react';
import CredentialsForm, {
  CREDENTIAL_TYPE_NONE,
} from 'components/Api/Forms/CredentialForms/CredentialsForm';

import { createApiData, verifyApiFile } from './../ApiHelpers';

import FileInput from './../../Shared/FileInput/FileInput';
import ApiForm from 'components/Api/Forms/ApiForm';
import { getRefsValues } from 'react-shared';

CreateApiForm.propTypes = {
  applicationId: PropTypes.string.isRequired,
  addAPI: PropTypes.func.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

export default function CreateApiForm({
  applicationId,
  addAPI,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const [credentialsType, setCredentialsType] = React.useState(
    CREDENTIAL_TYPE_NONE,
  );

  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
    group: React.useRef(null),
    targetUrl: React.useRef(null),
    type: React.useRef(null),
  };

  const fileRef = React.useRef(null);

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

    const expectedType = formValues.type.current.value;
    const { data, format, error } = await verifyApiFile(file, expectedType);
    if (error) {
      input.setCustomValidity(error);
      form.reportValidity();
    } else {
      setSpec({ data, format });
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    const name = formValues.name.current.value;
    const basicApiData = getRefsValues(formValues);
    const credentials = {
      type: credentialsType,
      oAuth: getRefsValues(credentialRefs.oAuth),
    };

    const apiData = createApiData(basicApiData, spec, credentials);
    try {
      await addAPI(apiData, applicationId);
      onCompleted(name, 'Event API created successfully');
    } catch (error) {
      console.warn(error);
      onError('Cannot create Event API');
    }
  };

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
      <TabGroup>
        <Tab key="api-data" id="api-data" title="API data">
          <FormSet>
            <ApiForm formValues={formValues} />
            <FormItem>
              <FileInput
                inputRef={fileRef}
                fileInputChanged={verifyFile}
                availableFormatsMessage={
                  'Available file types: JSON, YAML, XML'
                }
                acceptedFileFormats=".yml,.yaml,.json,.xml"
              />
            </FormItem>
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
