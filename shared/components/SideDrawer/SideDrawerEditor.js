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
  const yaml = jsyaml.safeDump(content);
  const children = (
    <>
      <h1 className="fd-has-type-4">YAML</h1>
      <ControlledEditor
        height="90vh"
        width="50em"
        language={'yaml'}
        theme="vs-light"
        value={yaml}
        options={{ readOnly: true }}
      />
    </>
  );

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
