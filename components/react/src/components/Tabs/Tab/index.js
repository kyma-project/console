import React from 'react';
import PropTypes from 'prop-types';

import { TabLink, TabTooltip, TabWrapper } from './components';

const Tab = ({
  additionalTitle,
  aditionalStatus,
  title,
  onClick,
  tabIndex,
  id,
  isActive,
  tooltipMinWidth,
  tooltipMaxWidth,
}) => {
  return (
    <TabWrapper key={tabIndex}>
      <TabLink
        onClick={event => {
          event.preventDefault();
          onClick(tabIndex);
        }}
        active={isActive}
        data-e2e-id={id}
      >
        {title}
        {!isActive && aditionalStatus}
        <TabTooltip minWidth={tooltipMinWidth} maxWidth={tooltipMaxWidth}>
          {additionalTitle}
        </TabTooltip>
      </TabLink>
    </TabWrapper>
  );
};

Tab.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
};

export default Tab;
