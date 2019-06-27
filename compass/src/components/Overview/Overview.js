import React, { useRef, Component } from 'react';
import './Overview.scss';
import { Icon } from 'fundamental-react/lib/Icon';

const Overview = () => {
  const compassInitialRotation = 70;
  const rotatingCompass = useRef(null);

  const handleMouseMove = e => {
    const compassCenter = {
      x:
        rotatingCompass.current.getBoundingClientRect().x +
        rotatingCompass.current.getBoundingClientRect().width / 2,
      y:
        rotatingCompass.current.getBoundingClientRect().y +
        rotatingCompass.current.getBoundingClientRect().height / 2,
    };
    const angle =
      Math.atan2(e.clientX - compassCenter.x, -(e.clientY - compassCenter.y)) *
      (180 / Math.PI);

    rotatingCompass.current.style = `transform: rotate(${angle -
      compassInitialRotation}deg); display:inline-block;`;
  };

  return (
    <section onMouseMove={handleMouseMove} className="fd-section center">
      <h1>
        Welcome to the Compass UI{' '}
        <span ref={rotatingCompass}>
          <Icon glyph="business-objects-explorer" size="xl" />
        </span>{' '}
      </h1>
      <img alt="Compass logo" src="compass-logo.png" />
    </section>
  );
};

export default Overview;
