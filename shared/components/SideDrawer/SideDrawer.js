import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './SideDrawer.scss';
import { Icon } from 'fundamental-react';

const SideDrawer = ({
  buttonText,
  isOpen,
  setOpen,
  children,
  bottomContent,
}) => {
  return (
    <div className={classNames('side-drawer', { 'side-drawer--open': isOpen })}>
      {!(!isOpen && !children) && (
        <button className="open-btn" onClick={() => setOpen(!isOpen)}>
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

export const useSideDrawer = (
  initialContent,
  bottomContent,
  buttonText = 'See code',
  isOpenInitially = false,
) => {
  const [content, setContent] = useState(initialContent);
  const [isOpen, setOpen] = useState(isOpenInitially);

  useEffect(() => {
    // return a function to skip changing the open state on initial render
    return _ => setOpen(true);
  }, [content]);

  const drawerComponent = content ? (
    <SideDrawer
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={buttonText}
      bottomContent={bottomContent}
    >
      {content}
    </SideDrawer>
  ) : null;

  return [drawerComponent, setContent];
};
