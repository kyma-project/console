import React from 'react';
import PropTypes from 'prop-types';

import { TabLink } from './components';

const Tab = ({ title, onClick, tabIndex, isActive }) => {
  return (
    <TabLink
      key={tabIndex}
      onClick={event => {
        event.preventDefault();
        onClick(tabIndex);
      }}
      active={isActive}
    >
      {title}
    </TabLink>
  );
};

Tab.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
};

export default Tab;
