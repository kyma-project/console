import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormSet, FormItem } from 'fundamental-react';
import FileInput from './../../Shared/FileInput/FileInput';

import {
  createEventAPIData,
  getEventApiFormat,
  readFile,
  parseEventApi,
  isAsyncApi,
} from './../ApiHelpers';
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

    const fileFormat = getEventApiFormat(file);
    if (fileFormat === null) {
      setSpec({ error: 'Error: Invalid file type' });
      return;
    }

    const data = await readFile(file);

    const parseResult = parseEventApi(data);

    if (!parseResult) {
      setSpec({ error: 'Spec file is invalid' });
      return;
    }

    const { spec, format } = parseResult;
    if (!isAsyncApi(spec)) {
      setSpec({
        error: 'Supplied spec does not have required "asyncapi" property',
      });
      return;
    }

    setSpec({ file, format, data });
  };

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
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
