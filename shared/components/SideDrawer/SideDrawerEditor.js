import React from 'react';
import { SideDrawer } from './SideDrawer';
import { ControlledEditor } from '@monaco-editor/react';

export const SideDrawerEditor = ({
  content,
  isOpen,
  setOpen,
  buttonText,
  bottomContent,
  hideDefaultButton,
}) => {
  const json = JSON.stringify(content, null, 1);
  const children = (
    <>
      <h1 className="fd-has-type-4">Code</h1>
      <ControlledEditor
        height="50em"
        width="50em"
        language={'json'}
        theme="vs-light"
        value={json}
        options={{ readOnly: true }}
      />
    </>
  );

  return (
    <SideDrawer
      textToCopy={json}
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
