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

  const labelClass = classNames('fd-file-upload__label', {
    'fd-file-upload__input--drag-over': draggingOverCounter !== 0,
  });

  return (
    <div
      className="fd-file-upload"
      onDrop={drop}
      onDragEnter={() => setDraggingCounter(draggingOverCounter + 1)}
      onDragLeave={() => setDraggingCounter(draggingOverCounter - 1)}
      onDragOver={dragOver}
    >
      {!!props.file && (
        <p className="fd-file-upload__file-name">{props.file.name}</p>
      )}
      <input
        type="file"
        id="file-upload"
        className="fd-file-upload__input"
        onChange={e => props.fileInputChanged(e.target.files[0])}
        accept=".yml,.yaml,.json"
      />
      <label htmlFor="file-upload" className={labelClass}>
        <span className="fd-file-upload__text">Browse</span>
        <p className="fd-file-upload__message"> or drop file here</p>
        <p className="fd-file-upload__message">
          Available file types: JSON, YAML.
        </p>
      </label>
      {!!props.error && <FormMessage type="error">{props.error} </FormMessage>}
    </div>
  );
}
