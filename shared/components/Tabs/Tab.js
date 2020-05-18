import React from 'react';
import PropTypes from 'prop-types';
import './Tab.scss';

export const Tab = ({ status, title, onClick, tabIndex, id, isActive }) => {
  return (
    <div className="fd-tabs__item" key={tabIndex}>
      <div
        className="fd-tabs__link fd-tabs__link--flex"
        onClick={event => {
          event.preventDefault();
          onClick(tabIndex);
        }}
        aria-selected={isActive}
        role="tab"
        data-e2e-id={id}
      >
        {title}
        {status}
      </div>
    </div>
  );
};

Tab.propTypes = {
  title: PropTypes.any,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
  status: PropTypes.node,
};
