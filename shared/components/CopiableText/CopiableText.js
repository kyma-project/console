import React from 'react';
import PropTypes from 'prop-types';
import './CopiableText.scss';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from 'fundamental-react';
import copyToCliboard from 'copy-to-clipboard';

CopiableText.propTypes = {
  textToCopy: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  children: PropTypes.node,
  iconOnly: PropTypes.bool,
  compact: PropTypes.bool,
};

export function CopiableText({
  textToCopy,
  buttonText,
  children,
  iconOnly,
  compact,
}) {
  return (
    <div className="copiable-text">
      {!iconOnly ? children || textToCopy : null}
      <Tooltip content="Copy to clipboard" position="top">
        <Button
          compact={compact}
          glyph="copy"
          option="light"
          className="fd-has-margin-left-tiny"
          onClick={() => copyToCliboard(textToCopy)}
        >
          {buttonText ? buttonText : null}
        </Button>
      </Tooltip>
    </div>
  );
}
