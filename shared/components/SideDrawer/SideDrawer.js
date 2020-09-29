import React from 'react';
import classNames from 'classnames';
import './SideDrawer.scss';
import { Button, Icon } from 'fundamental-react';
import { CopiableText } from '../CopiableText/CopiableText';

export const SideDrawer = ({
  buttonText,
  textToCopy,
  isOpen,
  setOpen,
  children,
  bottomContent,
  hideDefaultButton,
}) => {
  return (
    <div className={classNames('side-drawer', { 'side-drawer--open': isOpen })}>
      {(isOpen || children) && (
        <button
          className={`open-btn ${hideDefaultButton ? 'open-btn-hidden' : ''}`}
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
          {hideDefaultButton && (
            <Button option="emphasized" onClick={() => setOpen(!isOpen)}>
              Close
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};
