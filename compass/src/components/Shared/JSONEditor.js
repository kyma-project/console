import React, { Component } from "react";
import Ajv from "ajv";
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
    this.jsoneditor.setText(this.props.text);
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  afterValidation = text => {
    try {
      const ajv = new Ajv();
      const valid = ajv.validate(this.props.schema, JSON.parse(text));
      valid ? this.props.onSuccess() : this.props.onError();
    } catch (err) {
      this.props.onError();
    }
  };

  componentWillUpdate(nextProps) {
    if (nextProps.text === this.props.text) {
      return;
    }

    if (
      this.props.schema &&
      typeof this.props.onSuccess === "function" &&
      typeof this.props.onError === "function"
    ) {
      this.afterValidation(nextProps.text);
    }
    this.jsoneditor.updateText(nextProps.text);
  }

  render() {
    return <div className="jsoneditor-react-container" ref={elem => (this.container = elem)} />;
  }
}
