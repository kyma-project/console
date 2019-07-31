import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormMessage } from 'fundamental-react';

FileInput.propTypes = {
  fileInputChanged: PropTypes.func.isRequired,
  file: PropTypes.object,
  error: PropTypes.string,
};

export default function FileInput(props) {
  const [draggingOverCounter, setDraggingCounter] = useState(0);

  // needed for onDrag to fire
  function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    setDraggingCounter(0);
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation(); // to avoid event.js error
    props.fileInputChanged(e.dataTransfer.files[0]);
  }

  const labelClass = classNames('fd-asset-upload__label', {
    'fd-asset-upload__input--drag-over': draggingOverCounter !== 0,
  });

  return (
    <div
      className="fd-asset-upload"
      onDrop={drop}
      onDragEnter={() => setDraggingCounter(draggingOverCounter + 1)}
      onDragLeave={() => setDraggingCounter(draggingOverCounter - 1)}
      onDragOver={dragOver}
    >
      {!!props.file && (
        <p className="fd-asset-upload__file-name">{props.file.name}</p>
      )}
      <input
        type="file"
        id="file-upload"
        className="fd-asset-upload__input"
        onChange={e => props.fileInputChanged(e.target.files[0])}
        accept=".yml,.yaml,.json,.xml"
      />
      <label htmlFor="file-upload" className={labelClass}>
        <span className="fd-asset-upload__text">Browse</span>
        <p className="fd-asset-upload__message"> or drop file here</p>
        <p className="fd-asset-upload__message">
          Available file types: JSON, YAML, XML.
        </p>
      </label>
      {!!props.error && <FormMessage type="error">{props.error} </FormMessage>}
    </div>
  );
}
