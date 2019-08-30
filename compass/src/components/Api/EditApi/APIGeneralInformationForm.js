import React from 'react';
import PropTypes from 'prop-types';

import TextFormItem from '../../Shared/TextFormItem';

APIGeneralInformationForm.propTypes = {
  updateState: PropTypes.func.isRequired,
  apiInformation: PropTypes.object.isRequired,
  isAPI: PropTypes.bool.isRequired,
};

export default function APIGeneralInformationForm({
  updateState,
  apiInformation,
  isAPI,
}) {
  return (
    <>
      <TextFormItem
        inputKey="name"
        required
        label="Name"
        onChange={e => updateState({ name: e.target.value })}
        defaultValue={apiInformation.name}
      />
      <TextFormItem
        inputKey="description"
        label="Description"
        onChange={e => updateState({ description: e.target.value })}
        defaultValue={apiInformation.description}
      />
      <TextFormItem
        inputKey="group"
        label="Group"
        onChange={e => updateState({ group: e.target.value })}
        defaultValue={apiInformation.group}
      />
      {isAPI && (
        <TextFormItem
          inputKey="target-url"
          required
          type="url"
          label="Target URL"
          onChange={e => updateState({ targetURL: e.target.value })}
          defaultValue={apiInformation.targetURL}
        />
      )}
    </>
  );
}
