import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'fundamental-react';
import { ControlledEditor } from '@monaco-editor/react';
import CollapsiblePanel from './../CollapsiblePanel/CollapsiblePanel';

const CodeTab = ({
  lambdaCode,
  setLambdaCode,
  dependencies,
  setDependencies,
}) => {
  return (
    <>
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
            value={lambdaCode}
            onChange={(_, value) => setLambdaCode(value)}
          />
        </Panel.Body>
      </Panel>
      <CollapsiblePanel
        title="Dependencies"
        children={
          <ControlledEditor
            id="lambdaDependencies"
            height="10em"
            language="json"
            theme="vs-light"
            value={dependencies}
            onChange={(_, value) => setDependencies(value)}
          />
        }
        isOpenInitially={false}
        className="fd-has-margin-medium"
      />
    </>
  );
};

CodeTab.propTypes = {
  lambdaCode: PropTypes.string.isRequired,
  setLambdaCode: PropTypes.func.isRequired,
};

export default CodeTab;
