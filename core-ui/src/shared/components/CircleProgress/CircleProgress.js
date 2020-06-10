import React from 'react';
import PropTypes from 'prop-types';
import './CircleProgress.scss';

const CircleProgress = ({ value, color = 'blue', children }) => {
  return (
    <div className="circle-progress">
      <div className={`circle--${color}`}>
        <div className="progress-bar">
          <div className={`mask--dynamic fill--${value}`}></div>
          <div className={`mask--permanent`}></div>
        </div>
        <div className="inner-area">
          <div className="percentage">{value}%</div>
        </div>
      </div>
      {children}
    </div>
  );
};

CircleProgress.propTypes = {
  color: PropTypes.oneOf(['purple', 'green', 'blue', 'teal']),
  value: (props, propName) => {
    if (
      !Number.isInteger(props[propName]) ||
      props[propName] < 0 ||
      props[propName] > 100
    ) {
      return new Error(
        `'value' property is required and must be an integer of range [0,100]`,
      );
    }
  },
  children: PropTypes.node,
};

export default CircleProgress;
