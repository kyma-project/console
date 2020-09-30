import React from 'react';
import { SideDrawer } from './SideDrawer';
import { ControlledEditor } from '@monaco-editor/react';
import jsyaml from 'js-yaml';

export const SideDrawerEditor = ({
  content,
  isOpen,
  setOpen,
  buttonText,
  bottomContent,
  hideDefaultButton,
}) => {
  return (
    <SideDrawer
      textToCopy={yaml}
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={buttonText}
      bottomContent={bottomContent}
      hideDefaultButton={hideDefaultButton}
    >
      {children}
    </SideDrawer>
  );
};
