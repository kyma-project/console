import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import jsyaml from 'js-yaml';
import classNames from 'classnames';
import { parseXML } from './../../APIUploadHelper';
import { Icon } from '@kyma-project/react-components';
import './style.scss';

import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/mode/xml';
import 'brace/theme/github';

export default class APISpecForm extends React.Component {
  static propTypes = {
    updateState: PropTypes.func.isRequired,
    spec: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const textSpec = this.getTextSpec();
    this.state = {
      textSpec,
      originalTextSpec: textSpec,
      specError: '',
    };
  }

  getTextSpec = () => {
    const { format, data } = this.props.spec;
    switch (format) {
      case 'JSON':
        // format json
        return JSON.stringify(JSON.parse(data), null, 2);
      default:
        return data;
    }
  };

  parseInput = text => {
    const parsers = {
      JSON: JSON.parse,
      XML: parseXML,
      YAML: jsyaml.safeLoad,
    };

    try {
      return parsers[this.props.spec.format](text);
    } catch (e) {
      return null;
    }
  };

  getRequiredPropertyError(spec) {
    switch (this.props.spec.type) {
      case 'ASYNC_API':
        return 'asyncapi' in spec
          ? ''
          : 'Async API requires "asyncapi" property';
      case 'OPEN_API':
        return 'openapi' in spec ? '' : 'Open API requires "openapi" property';
      case 'ODATA':
        return 'edmx:Edmx' in spec ? '' : 'OData API requires "edmx:Edmx" tag';
      default:
        return '';
    }
  }

  getSpecError = text => {
    const spec = this.parseInput(text);
    if (!spec || typeof spec !== 'object') {
      return 'Invalid input';
    } else {
      return this.getRequiredPropertyError(spec);
    }
  };

  onChange = text => {
    const specError = this.getSpecError(text);
    const specChanged = text !== this.state.originalTextSpec;

    this.setState({
      textSpec: text,
      specError,
    });

    this.props.updateState({
      specChanged,
      data: text,
      isSpecValid: !specError,
    });
  };

  render() {
    const { specError, textSpec } = this.state;
    const editorMode = this.props.spec.format.toLowerCase();

    return (
      <>
        <div className="api-spec-form__error-wrapper">
          {specError && (
            <p>
              <Icon glyph="alert" size="s" />
              {specError}
            </p>
          )}
        </div>
        <AceEditor
          className={classNames('api-spec-form__editor', {
            'api-spec-form__editor--invalid': specError,
          })}
          mode={editorMode}
          theme="github"
          onChange={this.onChange}
          value={textSpec}
          width="100%"
          minLines={14}
          maxLines={28}
          debounceChangePeriod={100}
          name="edit-api-text-editor"
          editorProps={{ $blockScrolling: true }}
        />
      </>
    );
  }
}
