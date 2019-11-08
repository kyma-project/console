import React from 'react';
import PropTypes from 'prop-types';

const CodeTab = ({ codeComponent, dependenciesComponent }) => {
  return (
    <>
      {codeComponent}
      {dependenciesComponent}
    </>
  );
};

CodeTab.propTypes = {
  codeComponent: PropTypes.element.isRequired,
  dependenciesComponent: PropTypes.element.isRequired,
};

export default CodeTab;
