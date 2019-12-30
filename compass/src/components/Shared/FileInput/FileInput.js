import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FileInput.scss';

FileInput.propTypes = {
  fileInputChanged: PropTypes.func.isRequired,
  availableFormatsMessage: PropTypes.string,
  acceptedFileFormats: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default function FileInput({
  fileInputChanged,
  availableFormatsMessage,
  acceptedFileFormats,
  inputRef,
  required,
}) {
  const [fileName, setFileName] = useState('');
  const [draggingOverCounter, setDraggingCounter] = useState(0);

  // needed for onDrag to fire
  function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function fileChanged(file) {
    setFileName(file ? file.name : '');
    fileInputChanged(file);
  }

  function drop(e) {
    setDraggingCounter(0);
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation(); // to avoid event.js error
    fileChanged(e.dataTransfer.files[0]);
  }

  const labelClass = classNames('fd-asset-upload__label', {
    'fd-asset-upload__input--drag-over': draggingOverCounter !== 0,
  });

  return (
    <div
      className="fd-asset-upload file-input"
      onDrop={drop}
      onDragEnter={() => setDraggingCounter(draggingOverCounter + 1)}
      onDragLeave={() => setDraggingCounter(draggingOverCounter - 1)}
      onDragOver={dragOver}
    >
      {!!fileName && <p className="fd-asset-upload__file-name">{fileName}</p>}
      <input
        ref={inputRef}
        type="file"
        id="file-upload"
        onChange={e => fileChanged(e.target.files[0])}
        className="fd-asset-upload__input"
        accept={acceptedFileFormats}
        required={required}
      />
      <label htmlFor="file-upload" className={labelClass}>
        <span className="fd-asset-upload__text">Browse</span>
        <p className="fd-asset-upload__message"> or drop file here</p>
        {availableFormatsMessage && (
          <p className="fd-asset-upload__message">{availableFormatsMessage}</p>
        )}
      </label>
    </div>
  );
}
