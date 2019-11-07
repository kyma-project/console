import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'fundamental-react';
import { ControlledEditor } from '@monaco-editor/react';

const CodeTab = ({ lambdaCode, setLambdaCode }) => {
  return (
    <Panel className="fd-has-margin-medium">
      <Panel.Header>
        <Panel.Head title="Lambda Code" />
      </Panel.Header>
      <Panel.Body>
        <ControlledEditor
          id="lambdaContent"
          height="40em"
          language="javascript"
          theme="vs-light"
          value={lambdaCode}
          onChange={(_, value) => setLambdaCode(value)}
        />
      </Panel.Body>
    </Panel>
  );
};

CodeTab.propTypes = {
  lambdaCode: PropTypes.string.isRequired,
  setLambdaCode: PropTypes.func.isRequired,
};

export default CodeTab;
