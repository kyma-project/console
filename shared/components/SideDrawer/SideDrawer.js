import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './SideDrawer.scss';
import { Icon } from 'fundamental-react';

export const SideDrawer = ({
  btnText,
  isOpenInitially = false,
  onOpen,
  children,
  bottomContent,
}) => {
  const [isOpen, setOpen] = useState(isOpenInitially);

  useEffect(() => {
    if (typeof onOpen === 'function') onOpen();
  }, [isOpen]);

  return (
    <div className={classNames('side-drawer', { 'side-drawer--open': isOpen })}>
      <button className="open-btn" onClick={() => setOpen(!isOpen)}>
        <Icon
          glyph={isOpen ? 'open-command-field' : 'close-command-field'}
          size="l"
        />
        {btnText}
      </button>

      <section className="content">
        {children}

        <div className="bottom">{bottomContent}</div>
      </section>
    </div>
  );
};
