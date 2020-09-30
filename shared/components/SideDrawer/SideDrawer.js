import React from 'react';
import classNames from 'classnames';
import './SideDrawer.scss';
import { Button, Icon } from 'fundamental-react';
import { CopiableText } from '../CopiableText/CopiableText';

export const SideDrawer = ({
  buttonText,
  isOpen,
  setOpen,
  children,
  bottomContent,
}) => {
  let textToCopy;

  if (withYamlEditor) {
    textToCopy = jsyaml.safeDump(content);
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
