import React, { useState } from 'react';
import classNames from 'classnames';
import './SideDrawer.scss';
import { Icon } from 'fundamental-react';

export const SideDrawer = ({ btnText, isOpenInitially = true, onOpen }) => {
  const [isOpen, setOpen] = useState(isOpenInitially);

  return (
    <div className={classNames('side-drawer', { 'side-drawer--open': isOpen })}>
      <button className="open-btn" onClick={() => setOpen(!isOpen)}>
        <Icon
          glyph={isOpen ? 'open-command-field' : 'close-command-field'}
          size="l"
        />
        {btnText}
      </button>

      <section className="content">eeelo</section>
    </div>
  );
};
