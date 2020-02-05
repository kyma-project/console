import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'fundamental-react';
import classNames from 'classnames';

import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-github';

const languages = ['yaml', 'json', 'xml'];
languages.forEach(language => {
  require(`ace-builds/src-noconflict/mode-${language}`);
  require(`ace-builds/src-noconflict/snippets/${language}`);
});

ApiEditorForm.propTypes = {
  specText: PropTypes.string.isRequired,
  setSpecText: PropTypes.func.isRequired,
  specProvided: PropTypes.bool.isRequired,
  apiType: PropTypes.string,
  format: PropTypes.string.isRequired,
  verifyApi: PropTypes.func.isRequired,
  revalidateForm: PropTypes.func,
};

export default function ApiEditorForm({
  specText,
  setSpecText,
  format,
  apiType,
  specProvided,
  verifyApi,
  revalidateForm,
}) {
  const [specError, setSpecError] = React.useState('');
  const specValidityInput = React.useRef();

  const revalidateSpec = () => {
    if (specProvided) {
      const { error } = verifyApi(specText, format, apiType);
      specValidityInput.current.setCustomValidity(error || '');
      setSpecError(error);
    } else {
      specValidityInput.current.setCustomValidity('');
    }
    revalidateForm && revalidateForm();
  };

  React.useEffect(revalidateSpec, [format, specProvided, apiType, specText]);

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
      <input
        ref={specValidityInput}
        // as input type="hidden" won't trigger validation
        style={{ visibility: 'collapse' }}
      />
      <AceEditor
        className={classNames('api-spec-form__editor', {
          'api-spec-form__editor--invalid': specError,
        })}
        mode={format.toLowerCase()}
        theme="github"
        onChange={setSpecText}
        value={specText}
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
