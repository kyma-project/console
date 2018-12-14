import React from 'react';
import PropTypes from 'prop-types';

import { TabLink, TabTooltip, TabWrapper } from './components';

const Tab = ({ aditionalStatus, title, onClick, tabIndex, id, isActive }) => {
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
};

export default Tab;
