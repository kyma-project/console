import React from 'react';
import PropTypes from 'prop-types';

import FileInput from './../../../../Shared/FileInput/FileInput';
import TextFormItem from './TextFormItem';

import { FormItem, FormInput, FormLabel } from '@kyma-project/react-components';
import { InlineHelp } from 'fundamental-react';

import {
  isFileTypeValid,
  parseSpecFromText,
  getSpecType,
} from './APIUploadHelper';

APIDataForm.propTypes = {
  mainAPIType: PropTypes.string,
  updateState: PropTypes.func.isRequired,
};

export default function APIDataForm({ mainAPIType, updateState }) {
  const isAPI = mainAPIType === 'API';
  const [error, setError] = React.useState(null);
  const [file, setFile] = React.useState(null);

  function fileInputChanged(newFile) {
    if (!newFile) {
      return;
    }

    updateState({ mainAPIType: null, spec: null });
    setFile(null);

    if (!isFileTypeValid(newFile)) {
      setError('Error: Invalid file type.');
      return;
    }

    setError(null);
    setFile(newFile);

    const reader = new FileReader();
    reader.onload = processFile.bind(this);
    reader.readAsText(newFile);
  }

  function createTargetUrlTipText() {
    if (!mainAPIType) {
      return 'Please upload valid API spec file.';
    } else if (!isAPI) {
      return 'Target URL can be only specified for APIs.';
    }
    return '';
  }

  function processFile(e) {
    const fileContent = e.target.result;
    const parsedSpec = parseSpecFromText(fileContent);

    if (!parsedSpec) {
      setError('Error: API spec file is invalid.');
      return;
    }

    const type = getSpecType(parsedSpec.spec);
    if (!type) {
      setError('Error: cannot recognize spec file.');
      return;
    }

    updateState({
      spec: parsedSpec.spec,
      mainAPIType: type.mainType,
      apiSubType: type.subType,
      actualFileType: parsedSpec.type,
      loadedFileContent: fileContent,
    });
  }

  return (
    <form>
      <TextFormItem
        inputKey="name"
        required
        label="Name"
        onChange={e => updateState({ name: e.target.value })}
      />
      <TextFormItem
        inputKey="description"
        label="Description"
        onChange={e => updateState({ description: e.target.value })}
      />
      <TextFormItem
        inputKey="group"
        label="Group"
        onChange={e => updateState({ group: e.target.value })}
      />
      <FormItem key="targetURL">
        <FormLabel
          htmlFor="targetURL"
          required
          className="target-url__label--info"
        >
          Target URL
        </FormLabel>
        {!isAPI && (
          <InlineHelp placement="right" text={createTargetUrlTipText()} />
        )}
        <FormInput
          disabled={!isAPI}
          id="targetURL"
          type="text"
          placeholder="Target URL"
          onChange={e => updateState({ targetURL: e.target.value })}
        />
      </FormItem>
      <FormItem key="spec">
        <FormLabel htmlFor="spec">Spec</FormLabel>
        <FileInput
          fileInputChanged={fileInputChanged}
          file={file}
          error={error}
          availableFormatsMessage={'Available file types: JSON, YAML, XML.'}
          acceptedFileFormats={'.yml,.yaml,.json,.xml'}
        />
      </FormItem>
    </form>
  );
}
