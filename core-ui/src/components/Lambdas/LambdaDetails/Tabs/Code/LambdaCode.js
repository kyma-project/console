import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'fundamental-react';
import { ControlledEditor } from '@monaco-editor/react';

const LambdaCode = ({ code, setCode }) => {
  return (
    <Panel className="fd-has-margin-medium">
      <Panel.Header>
        <Panel.Head title="Lambda Code" />
      </Panel.Header>
      <Panel.Body>
        <ControlledEditor
          id="lambdaContent"
          height="30em"
          language="javascript"
          theme="vs-light"
          value={code}
          onChange={(_, value) => setCode(value)}
        />
      </Panel.Body>
    </Panel>
  );
};

LambdaCode.propTypes = {
  code: PropTypes.string.isRequired,
  setCode: PropTypes.func.isRequired,
};

export default LambdaCode;
