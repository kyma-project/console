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
        <div className="bottom">{bottomContent}</div>
      </section>
    </div>
  );
};
