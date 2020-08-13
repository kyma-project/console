import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip as TippyTooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import './Tooltip.scss';

export const Tooltip = ({
  children,
  content,
  position,
  trigger,
  tippyProps,
}) => {
  return (
    <TippyTooltip
      html={content}
      position={position}
      trigger={trigger}
      {...tippyProps}
    >
      {children}
    </TippyTooltip>
  );
};

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  trigger: PropTypes.oneOf(['mouseenter', 'focus', 'click', 'manual']),
  children: PropTypes.node.isRequired,
};

Tooltip.defaultProps = {
  trigger: 'mouseenter',
};
