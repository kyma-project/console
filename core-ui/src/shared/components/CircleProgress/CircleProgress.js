import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './CircleProgress.scss';

const CircleProgress = ({ value, max, color = 'blue', onClick, children }) => {
  const circleClasses = classNames(`circle--${color}`, {
    'cursor-pointer': onClick,
  });

  const percent = max ? Math.round((value * 100) / max) : 0;
  return (
    <div className="circle-progress" onClick={onClick}>
      <div className={circleClasses}>
        <div className="progress-bar">
          <div className={`mask--dynamic fill--${percent}`}></div>
          <div className={`mask--permanent`}></div>
        </div>
        <div className="inner-area">
          <div className="percentage">
            {value}/{max}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

CircleProgress.propTypes = {
  color: PropTypes.oneOf(['purple', 'green', 'blue', 'teal']),
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default CircleProgress;
