import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'fundamental-react';

export const Link = ({ url, text }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {text || url}
      <Icon glyph="inspect" size="s" className="fd-has-margin-left-tiny" />
    </a>
  );
};

Link.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string,
};
