import React from 'react';
import './CopiableText.scss';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from 'fundamental-react';
import copyToCliboard from 'copy-to-clipboard';

export function CopiableText({ text }) {
  return (
    <div className="copiable-text">
      {text}
      <Tooltip title="Copy to clipboard" position="top">
        <Button
          option="light"
          compact
          glyph="copy"
          onClick={() => copyToCliboard(text)}
        />
      </Tooltip>
    </div>
  );
}
