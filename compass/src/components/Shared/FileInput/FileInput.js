import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormMessage } from 'fundamental-react';
import './style.scss';

FileInput.propTypes = {
  fileInputChanged: PropTypes.func.isRequired,
  file: PropTypes.object,
  error: PropTypes.string,
  availableFormatsMessage: PropTypes.string,
  acceptedFileFormats: PropTypes.string.isRequired,
};

export default function FileInput({
  fileInputChanged,
  file,
  error,
  availableFormatsMessage,
  acceptedFileFormats,
}) {
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
    fileInputChanged(e.dataTransfer.files[0]);
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
      {!!file && <p className="fd-asset-upload__file-name">{file.name}</p>}
      <input
        type="file"
        id="file-upload"
        className="fd-asset-upload__input"
        onChange={e => fileInputChanged(e.target.files[0])}
        accept={acceptedFileFormats}
      />
      <label htmlFor="file-upload" className={labelClass}>
        <span className="fd-asset-upload__text">Browse</span>
        <p className="fd-asset-upload__message"> or drop file here</p>
        {availableFormatsMessage && (
          <p className="fd-asset-upload__message">{availableFormatsMessage}</p>
        )}
      </label>
      {!!error && <FormMessage type="error">{error} </FormMessage>}
    </div>
  );
}
