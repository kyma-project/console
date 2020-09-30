import React, { useState, useEffect } from 'react';
import { SideDrawer } from '../components/SideDrawer/SideDrawer';

import { ControlledEditor } from '@monaco-editor/react';
import jsyaml from 'js-yaml';

export const useSideDrawer = (
  withYamlEditor,
  initialContent,
  bottomContent,
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
    <SideDrawer
      withYamlEditor={withYamlEditor}
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={buttonText}
      bottomContent={bottomContent}
    >
      {content}
    </SideDrawer>
  ) : null;

  return [drawerComponent, setContent, setOpen];
};
