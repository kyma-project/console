import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import { TabGroup, Tab, FormSet, FormItem } from 'fundamental-react';
import CredentialsForm, {
  CREDENTIAL_TYPE_NONE,
} from 'components/Api/Forms/CredentialForms/CredentialsForm';

import {
  createApiData,
  getApiFormat,
  readFile,
  isOpenApi,
  parseApi,
  isOData,
} from './../ApiHelpers';

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

  const credentialRefs = {
    oAuth: {
      clientId: React.useRef(null),
      clientSecret: React.useRef(null),
      url: React.useRef(null),
    },
  };

  const [spec, setSpec] = React.useState({
    file: null,
    data: '',
    format: null,
    error: '',
  });

  const handleFormSubmit = async e => {
    e.preventDefault();

    const name = formValues.name.current.value;
    const basicApiData = getRefsValues(formValues);
    const specData = (({ data, format }) => ({ data, format }))(spec);
    const credentials = {
      type: credentialsType,
      oAuth: getRefsValues(credentialRefs.oAuth),
    };

    const apiData = createApiData(basicApiData, specData, credentials);
    try {
      await addAPI(apiData, applicationId);
      onCompleted(name, 'Event API created successfully');
    } catch (error) {
      console.warn(error);
      onError('Cannot create Event API');
    }
  };

  const updateSpecFile = async file => {
    if (!file) {
      return;
    }

    const fileFormat = getApiFormat(file);
    if (fileFormat === null) {
      setSpec({ error: 'Error: Invalid file type' });
      return;
    }

    const data = await readFile(file);

    const parseResult = parseApi(data);

    if (!parseResult) {
      setSpec({ error: 'Spec file is invalid' });
      return;
    }

    const { spec, format } = parseResult;
    const type = formValues.type.current.value;

    if (!isOpenApi(spec) && type === 'OPEN_API') {
      setSpec({
        error: 'Supplied spec does not have required "openapi" property',
      });
      return;
    }
    if (!isOData(spec) && type === 'ODATA') {
      setSpec({
        error: 'Supplied spec does not have required "edmx:Edmx" property',
      });
      return;
    }

    setSpec({ file, format, data });
  };

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
      <TabGroup>
        <Tab key="api-data" id="api-data" title="API data">
          <FormSet>
            <ApiForm formValues={formValues} />
            <FormItem>
              <FileInput
                file={spec.file}
                error={spec.error}
                fileInputChanged={updateSpecFile}
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
