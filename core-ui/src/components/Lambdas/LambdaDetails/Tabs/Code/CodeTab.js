import React from 'react';
import PropTypes from 'prop-types';

const CodeTab = ({ codeEditorComponent, dependenciesComponent }) => {
  return (
    <>
      {codeEditorComponent}
      {dependenciesComponent}
    </>
  );
};

CodeTab.propTypes = {
  codeEditorComponent: PropTypes.element.isRequired,
  dependenciesComponent: PropTypes.element.isRequired,
};

export default CodeTab;
