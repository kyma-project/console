import React, { useState } from "react";
import classNames from "classnames";
import { FormMessage } from "fundamental-react";

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
  const labelClass = classNames("fd-file-upload__label", {
    "fd-file-upload__input--drag-over": draggingOverCounter !== 0
  });

  return (
    <div
      className="fd-file-upload"
      onDrop={drop}
      onDragEnter={() => setDraggingCounter(draggingOverCounter + 1)}
      onDragLeave={() => setDraggingCounter(draggingOverCounter - 1)}
      onDragOver={dragOver}
    >
      {!!props.file && <p className="fd-file-upload__file-name">{props.file.name}</p>}
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
        <p className="fd-file-upload__message">Available file types: JSON, YAML.</p>
      </label>
      {!!props.error && <FormMessage type="error">{props.error} </FormMessage>}
    </div>
  );
}

// export default class FileInput2 extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       draggingOverCounter: 0,

//     };

//     this.dragEnter = this.dragEnter.bind(this);
//     this.dragLeave = this.dragLeave.bind(this);
//     this.dragOver = this.dragOver.bind(this);
//     this.drop = this.drop.bind(this);
//   }

//   // needed for onDrag to fire
//   dragOver(e) {
//     e.stopPropagation();
//     e.preventDefault();
//   }

//   dragEnter(e) {
//     this.setState({ draggingOverCounter: this.state.draggingOverCounter + 1 });
//   }

//   dragLeave() {
//     this.setState({ draggingOverCounter: this.state.draggingOverCounter - 1 });
//   }

//   drop(e) {
//     this.setState({ draggingOverCounter: 0 });
//     e.preventDefault();
//     e.nativeEvent.stopImmediatePropagation(); // to avoid event.js error
//     this.props.fileInputChanged(e.dataTransfer.files[0]);
//   }

//   render() {

//     );
//   }
// }
