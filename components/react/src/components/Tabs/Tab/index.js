import React from 'react';
import PropTypes from 'prop-types';

import { TabLink, TabWrapper } from './components';

const Tab = ({
  aditionalStatus,
  status,
  title,
  onClick,
  tabIndex,
  id,
  isActive,
  smallPadding,
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
        smallPadding={smallPadding}
      >
        {title}
        {status}
        {!isActive && aditionalStatus}
      </TabLink>
    </TabWrapper>
  );
};

Tab.propTypes = {
  title: PropTypes.any,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
  margin: PropTypes.string,
  background: PropTypes.string,
  status: PropTypes.node,
};

export default Tab;
