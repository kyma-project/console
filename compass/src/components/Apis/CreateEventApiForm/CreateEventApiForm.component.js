import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormSet, FormItem } from 'fundamental-react';
import FileInput from './../../Shared/FileInput/FileInput';

import { createEventAPIData, isYAML, isJSON, readFile } from './../ApiHelpers';
import EventApiForm from 'components/Api/Forms/EventApiForm';
import { getRefsValues } from 'react-shared';

CreateEventApiForm.propTypes = {
  applicationId: PropTypes.string.isRequired,
  addEventAPI: PropTypes.func.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

const getFormat = file => {
  if (isYAML(file)) {
    return 'YAML';
  } else if (isJSON(file)) {
    return 'JSON';
  } else {
    return null;
  }
};

export default function CreateEventApiForm({
  applicationId,
  addEventAPI,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
    group: React.useRef(null),
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

    const apiData = createEventAPIData(basicApiData, specData);

    try {
      await addEventAPI(apiData, applicationId);
      onCompleted(name, 'Event API created successfully');
    } catch (error) {
      onError('Cannot create Event API');
    }
  };

  const updateSpecFile = async file => {
    if (!file) {
      return;
    }

    const format = getFormat(file);
    if (format === null) {
      setSpec({ file, error: 'Error: Invalid file type' });
      return;
    }

    const data = await readFile(file);
    // todo moze walidacja ej
    setSpec({ file, format, data });
  };

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      style={{ width: '30em' }} // todo
      onSubmit={handleFormSubmit}
    >
      <FormSet>
        <EventApiForm formValues={formValues} />
        <FormItem>
          <FileInput
            file={spec.file}
            error={spec.error}
            fileInputChanged={updateSpecFile}
            availableFormatsMessage={'Available file types: JSON, YAML'}
            acceptedFileFormats=".yml,.yaml,.json"
          />
        </FormItem>
      </FormSet>
    </form>
  );
}
