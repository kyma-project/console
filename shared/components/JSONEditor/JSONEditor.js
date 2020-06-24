import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ajv from 'ajv';
import _JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export class JSONEditor extends Component {
  static propTypes = {
    readonly: PropTypes.bool,
    mode: PropTypes.oneOf(['tree', 'view', 'form', 'code']),
  };

  static defaultProps = {
    mode: 'code',
  };

  componentDidMount() {
    const options = {
      escapeUnicode: false,
      history: true,
      indentation: 2,
      mode: this.props.mode,
      search: true,
      sortObjectKeys: false,
      mainMenuBar: false,
      onChangeText: this.props.onChangeText,
      schema: this.props.schema,
    };

    this.jsoneditor = new _JSONEditor(this.container, options);
    this.jsoneditor.setText(this.props.text);
    this.jsoneditor.aceEditor.setOption('readOnly', this.props.readonly);
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
      typeof this.props.onSuccess === 'function' &&
      typeof this.props.onError === 'function'
    ) {
      this.afterValidation(nextProps.text);
    }
    this.jsoneditor.updateText(nextProps.text);
  }

  render() {
    return (
      <div
        style={{ height: '100%' }}
        className="jsoneditor-react-container"
        ref={elem => (this.container = elem)}
      />
    );
  }
}
