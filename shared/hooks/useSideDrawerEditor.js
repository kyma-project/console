import React, { useState, useEffect } from 'react';
import { SideDrawerEditor } from '../components/SideDrawer/SideDrawerEditor';

export const useSideDrawerEditor = (
  initialContent,
  bottomContent,
  hideDefaultButton = false,
  buttonText = 'YAML code',
  isOpenInitially = false,
) => {
  const [content, setContent] = useState(initialContent);
  const [isOpen, setOpen] = useState(isOpenInitially);

  useEffect(() => {
    // return a function to skip changing the open state on initial render
    return _ => setOpen(true);
  }, [content]);

  const drawerComponent = content ? (
    <SideDrawerEditor
      content={content}
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={buttonText}
      bottomContent={bottomContent}
      hideDefaultButton={hideDefaultButton}
    />
  ) : null;

  return [drawerComponent, setContent];
};
