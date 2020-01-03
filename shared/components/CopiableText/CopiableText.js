import React from 'react';
import PropTypes from 'prop-types';
import './CopiableText.scss';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from 'fundamental-react';
import copyToCliboard from 'copy-to-clipboard';

CopiableText.propTypes = {
  textToCopy: PropTypes.string.isRequired,
  caption: PropTypes.node,
};

export function CopiableText({ textToCopy, caption }) {
  return (
    <div className="copiable-text">
      {caption || textToCopy}
      <Tooltip title="Copy to clipboard" position="top">
        <Button
          option="light"
          compact
          glyph="copy"
          onClick={() => copyToCliboard(textToCopy)}
        />
      </Tooltip>
    </div>
  );
}
