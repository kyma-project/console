import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Panel, LayoutGrid, Button } from 'fundamental-react';
import Editor from '@monaco-editor/react';
import './Code.scss';
import CollapsiblePanel from '../CollapsiblePanel/CollapsiblePanel';

const CodeTab = ({ lambdaCode, contentRef }) => {
  const [isCodeExpanded, setCodeExpanded] = useState(false);
  const editorInstance = useRef(null);

  function handleEditorDidMount(valueGetter, editor) {
    editorInstance.current = editor;
    contentRef.current = valueGetter;
  }

  return (
    <div
      className={classNames([
        'fd-has-margin-medium',
        'code-tab-grid',
        { 'code-tab-grid--expanded': isCodeExpanded },
      ])}
    >
      <Panel className="col-1">
        <Panel.Header>
          <Panel.Head title="Lambda Code" />
          <Panel.Actions>
            <Button
              glyph="resize-horizontal"
              option="light"
              onClick={() => setCodeExpanded(!isCodeExpanded)}
              compact
            />
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body>
          <Editor
            id="lambdaContent"
            height="40em"
            language="javascript"
            theme="vs-light"
            value={lambdaCode}
            editorDidMount={handleEditorDidMount}
            loading="Loading editor..."
          />
        </Panel.Body>
      </Panel>

      <div className="col-2">
        <CollapsiblePanel
          title="testtitle"
          content="abcd"
          addAction={() => alert('This is the form. Please fill it.')}
        >
          test
        </CollapsiblePanel>
        <CollapsiblePanel title="aaaaa">
          Lorem ipsum <br />
          costam costama <br />
          aasdadgdsgs dsg adsg sadg <br />
          adsg sdg asdg adsg
          <br />
          dsg adsg
          <br />
        </CollapsiblePanel>
      </div>
    </div>
  );
};

export default CodeTab;
