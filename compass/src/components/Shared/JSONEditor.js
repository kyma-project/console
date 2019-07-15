import React, { Component } from "react";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

export default class JSONEditorComponent extends Component {
  componentDidMount() {
    const options = {
      escapeUnicode: false,
      history: true,
      indentation: 2,
      mode: "code",
      search: true,
      sortObjectKeys: false,
      mainMenuBar: false,
      onChangeText: this.props.onChangeText,
      schema: this.props.schema ? this.props.schema : null
    };
    this.jsoneditor = new JSONEditor(this.container, options);
    console.log(this.jsoneditor);
    this.jsoneditor.setText(this.props.text);
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  componentWillUpdate(nextProps) {
    this.jsoneditor.updateText(nextProps.text);
  }

  getAnnotations() {
    return this.jsoneditor;
  }

  render() {
    return <div className="jsoneditor-react-container" ref={elem => (this.container = elem)} />;
  }
}
