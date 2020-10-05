import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ControlledEditor } from '@monaco-editor/react';
import jsyaml from 'js-yaml';
import { Button, Icon } from 'fundamental-react';

import './SideDrawer.scss';
import { CopiableText } from '../CopiableText/CopiableText';

export const SideDrawer = ({
  buttonText,
  isOpen,
  setOpen,
  children,
  bottomContent,
  withYamlEditor,
}) => {
  let textToCopy;

  if (withYamlEditor) {
    textToCopy = jsyaml.safeDump(children);
    children = (
      <>
        <h1 className="fd-has-type-4">YAML</h1>
        <ControlledEditor
          height="90vh"
          width="50em"
          language={'yaml'}
          theme="vs-light"
          value={textToCopy}
          options={{ readOnly: true }}
        />
      </>
    );
  }

  return (
    <div className={classNames('side-drawer', { 'side-drawer--open': isOpen })}>
      {(isOpen || children) && (
        <button
          className={`open-btn ${!buttonText ? 'open-btn-hidden' : ''}`}
          onClick={() => setOpen(!isOpen)}
        >
          <Icon
            glyph={isOpen ? 'open-command-field' : 'close-command-field'}
            size="l"
          />
          {buttonText}
        </button>
      )}

      <section className="content">
        {children}
        <div className="bottom">
          {bottomContent}
          {textToCopy && (
            <CopiableText
              textToCopy={textToCopy}
              iconOnly={true}
              buttonText="Copy"
            />
          )}
          {!buttonText && (
            <Button option="emphasized" onClick={() => setOpen(!isOpen)}>
              Close
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

SideDrawer.propTypes = {
  children: PropTypes.any.isRequired,
  bottomContent: PropTypes.element,
  withYamlEditor: PropTypes.bool,
  buttonText: PropTypes.string,
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
};
