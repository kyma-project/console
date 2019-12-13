import { Panel } from 'fundamental-react';
import React from 'react';
import PropTypes from 'prop-types';

const PanelEntry = ({ title, content }) => (
  <Panel.Body>
    <p className="fd-has-color-text-4 fd-has-margin-bottom-none">{title}</p>
    {content}
  </Panel.Body>
);

PanelEntry.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
};

export default PanelEntry;
