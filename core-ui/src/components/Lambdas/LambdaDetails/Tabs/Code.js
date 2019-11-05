import React from 'react';
import { Panel } from 'fundamental-react';
import Editor from '@monaco-editor/react';

const CodeTab = ({ lambdaCode, contentRef }) => {
  function handleEditorDidMount(valueGetter) {
    contentRef.current = valueGetter;
  }
  return (
    <Panel className="fd-has-margin-medium">
      <Panel.Header>
        <Panel.Head title="Lambda Code" />
      </Panel.Header>
      <Panel.Body>
        <Editor
          id="lambdaContent"
          height="40em"
          language="javascript"
          theme="vs-light"
          value={lambdaCode}
          editorDidMount={handleEditorDidMount}
        />
      </Panel.Body>
    </Panel>
  );
};

export default CodeTab;
