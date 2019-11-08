import React from 'react';
import PropTypes from 'prop-types';
import { ControlledEditor } from '@monaco-editor/react';
import { CollapsiblePanel } from 'react-shared';

const LambdaDependencies = ({ dependencies, setDependencies }) => {
  return (
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
  );
};

LambdaDependencies.propTypes = {
  dependencies: PropTypes.string.isRequired,
  setDependencies: PropTypes.func.isRequired,
};

export default LambdaDependencies;
