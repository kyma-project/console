import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormSet } from 'fundamental-react';
import FileInput from '../../Shared/FileInput/FileInput';

import { createEventAPIData, verifyEventApiFile } from './../ApiHelpers';
import EventApiForm from './../Forms/EventApiForm';
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
  const [specProvided, setSpecProvided] = React.useState(false);

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

    const { data, format, error } = await verifyEventApiFile(file);
    if (error) {
      input.setCustomValidity(error);
      form.reportValidity();
    } else {
      setSpec({ data, format });
    }

    onChange(formElementRef.current);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    const basicApiData = getRefsValues(formValues);
    const specData = specProvided ? spec : null;
    const eventApiData = createEventAPIData(basicApiData, specData);

    try {
      await addEventAPI(eventApiData, applicationId);
      onCompleted(basicApiData.name, 'Event Definition created successfully');
    } catch (error) {
      onError('Cannot create Event Definition');
    }
  };

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      onSubmit={handleFormSubmit}
      style={{ height: '375px' }}
    >
      <FormSet>
        <EventApiForm formValues={formValues} />
        <p
          className="link fd-has-margin-bottom-s clear-underline"
          onClick={() => setSpecProvided(!specProvided)}
        >
          {specProvided ? 'Remove specification' : 'Add specification'}
        </p>
        {specProvided && (
          <FileInput
            inputRef={fileRef}
            fileInputChanged={verifyFile}
            availableFormatsMessage={'Available file types: JSON, YAML'}
            acceptedFileFormats=".yml,.yaml,.json"
            required
          />
        )}
      </FormSet>
    </form>
  );
}
