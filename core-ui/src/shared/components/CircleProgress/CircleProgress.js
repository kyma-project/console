import React, { useState } from 'react';
import './CircleProgress.scss';
// import classNames

const CircleProgress = () => {
  const [p, setP] = useState(15);
  function handleChange(e) {
    setP(e.target.value);
  }
  return (
    <>
      <input
        type="range"
        id="vol"
        name="vol"
        min="0"
        max="100"
        onChange={handleChange}
      ></input>

      <div className="circle-progress">
        <div className="progress-bar">
          <div className={`mask mask--dynamic fill--${p}`}></div>
          <div className={`mask mask--permanent`}></div>
        </div>
        <div className="inner-area">
          <div className="percentage">{p}%</div>
        </div>
      </div>
    </>
  );
};

export default CircleProgress;
