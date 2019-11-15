import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip as TippyTooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

export const Tooltip = ({ children, title, position, trigger, tippyProps }) => {
  return (
    <TippyTooltip
      title={title}
      position={position}
      trigger={trigger}
      {...tippyProps}
    >
      {children}
    </TippyTooltip>
  );
};

Tooltip.propTypes = {
  title: PropTypes.string.isRequired,
  position: PropTypes.oneOf('top', 'bottom', 'left', 'right'),
  trigger: PropTypes.oneOf('mouseenter', 'focus', 'click', 'manual'),
  children: PropTypes.node.isRequired,
};

Tooltip.defaultProps = {
  trigger: 'mouseenter',
};
