import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import { FormSet, FormItem, FormLabel, FormSelect } from 'fundamental-react';
import { createApiData, verifyApiFile } from '../ApiHelpers';

import ApiForm from './../Forms/ApiForm';
import { getRefsValues, FileInput } from 'react-shared';

import { useMutation } from 'react-apollo';
import { ADD_API_DEFINITION } from '../gql';
import { GET_API_PACKAGE } from 'components/ApiPackages/gql';

CreateApiForm.propTypes = {
  apiPackageId: PropTypes.string.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

export default function CreateApiForm({
  applicationId,
  apiPackageId,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const [addApi] = useMutation(ADD_API_DEFINITION, {
    refetchQueries: () => [
      {
        query: GET_API_PACKAGE,
        variables: {
          applicationId: applicationId,
          apiPackageId: apiPackageId,
        },
      },
    ],
  });

  const [specProvided, setSpecProvided] = React.useState(false);

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
    const specData = specProvided
      ? { ...spec, type: apiTypeRef.current.value }
      : null;

    const apiData = createApiData(basicApiData, specData);

    try {
      await addApi({
        variables: {
          apiPackageId,
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
      style={{ height: '600px' }}
    >
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
    </form>
  );
}
