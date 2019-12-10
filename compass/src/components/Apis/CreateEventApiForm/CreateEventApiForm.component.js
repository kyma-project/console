import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormSet } from 'fundamental-react';
import FileInput from './../../Shared/FileInput/FileInput.1';

import { createEventAPIData, verifyEventApiFile } from './../ApiHelpers';
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

  const fileRef = React.useRef(null);

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

    const { spec, format, error } = await verifyEventApiFile(file);
    if (error) {
      input.setCustomValidity(error);
      form.reportValidity();
    } else {
      setSpec({ spec, format });
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    const name = formValues.name.current.value;
    const basicApiData = getRefsValues(formValues);
    const apiData = createEventAPIData(basicApiData, spec);

    try {
      await addEventAPI(apiData, applicationId);
      onCompleted(name, 'Event API created successfully');
    } catch (error) {
      onError('Cannot create Event API');
    }
  };

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
      <FormSet>
        <EventApiForm formValues={formValues} />
        <FileInput
          inputRef={fileRef}
          fileInputChanged={verifyFile}
          availableFormatsMessage={'Available file types: JSON, YAML'}
          acceptedFileFormats=".yml,.yaml,.json"
        />
      </FormSet>
    </form>
  );
}
