import React from 'react';
import { Panel, LayoutGrid } from 'fundamental-react';
import Editor from '@monaco-editor/react';

import './Code.scss';
import CollapsiblePanel from '../CollapsiblePanel/CollapsiblePanel';

const CodeTab = ({ lambdaCode, contentRef }) => {
  function handleEditorDidMount(valueGetter) {
    contentRef.current = valueGetter;
  }
  return (
    <div className="fd-has-margin-medium code-tab-grid">
      <Panel className="col-1">
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
      <div className="col-2">
        <CollapsiblePanel title="testtitle" content="abcd" />
        <CollapsiblePanel title="aaaaa" content="bbbb" />
      </div>
    </div>
  );
};

export default CodeTab;
