import React from 'react';
import PropTypes from 'prop-types';
import './CopiableText.scss';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from 'fundamental-react';
import copyToCliboard from 'copy-to-clipboard';

CopiableText.propTypes = {
  textToCopy: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export function CopiableText({ textToCopy, children }) {
  return (
    <div className="copiable-text">
      {children || textToCopy}
      <Tooltip title="Copy to clipboard" position="top">
        <Button
          compact
          glyph="copy"
          option="light"
          className="fd-has-margin-left-tiny"
          onClick={() => copyToCliboard(textToCopy)}
        />
      </Tooltip>
    </div>
  );
}
