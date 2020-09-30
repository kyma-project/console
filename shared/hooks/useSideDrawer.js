import React, { useState, useEffect } from 'react';
import { SideDrawer } from '../components/SideDrawer/SideDrawer';

import { ControlledEditor } from '@monaco-editor/react';
import jsyaml from 'js-yaml';

export const useSideDrawer = (
  withYamlEditor,
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

  let yaml;
  let yamlEditorContent;
  if (withYamlEditor) {
    yaml = jsyaml.safeDump(content);
    yamlEditorContent = (
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
  }

  const drawerComponent = content ? (
    <SideDrawer
      textToCopy={withYamlEditor ? yaml : null}
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={buttonText}
      bottomContent={bottomContent}
      hideDefaultButton={hideDefaultButton}
    >
      {withYamlEditor ? yamlEditorContent : content}
    </SideDrawer>
  ) : null;

  return [drawerComponent, setContent, setOpen];
};
