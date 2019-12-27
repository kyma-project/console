import { Panel } from 'fundamental-react';
import React from 'react';
import PropTypes from 'prop-types';

const PanelEntry = ({ title, children }) => (
  <Panel.Body>
    <p className="fd-has-color-text-4 fd-has-margin-bottom-none">{title}</p>
    {children}
  </Panel.Body>
);

PanelEntry.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PanelEntry;
