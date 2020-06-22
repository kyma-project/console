import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './CircleProgress.scss';

const CircleProgress = ({ value, color = 'blue', onClick, children }) => {
  const circleClasses = classNames(`circle--${color}`, {
    'cursor-pointer': onClick,
  });

  return (
    <div className="circle-progress" onClick={onClick}>
      <div className={circleClasses}>
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
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default CircleProgress;
