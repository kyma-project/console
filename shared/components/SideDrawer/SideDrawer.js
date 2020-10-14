import React from 'react';
import classNames from 'classnames';
import './SideDrawer.scss';
import { Button, Icon } from 'fundamental-react';

export const SideDrawer = ({
  buttonText,
  isOpen,
  setOpen,
  children,
  bottomContent,
  hideDefaultButton,
  onManualClose = _ => {},
}) => {
  return (
    <div className={classNames('side-drawer', { 'side-drawer--open': isOpen })}>
      {(isOpen || children) && (
        <button
          className={`open-btn ${hideDefaultButton ? 'open-btn-hidden' : ''}`}
          onClick={() => {
            setOpen(!isOpen);
            onManualClose();
          }}
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
          {hideDefaultButton && (
            <Button
              option="emphasized"
              onClick={() => {
                setOpen(!isOpen), onManualClose();
              }}
            >
              Close
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};
