import React, { useRef } from 'react';
import './Overview.scss';
import { Panel } from 'fundamental-react/lib/Panel';
import { Icon } from 'fundamental-react/lib/Icon';

const Overview = () => {
  const compassInitialRotation = 70;
  const rotatingCompass = useRef(null);

  const handleMouseMove = e => {
    const compassRect = rotatingCompass.current.getBoundingClientRect();
    const compassCenter = {
      x: compassRect.x + compassRect.width / 2,
      y: compassRect.y + compassRect.height / 2,
    };
    const angle =
      Math.atan2(e.clientX - compassCenter.x, -(e.clientY - compassCenter.y)) *
      (180 / Math.PI);

    rotatingCompass.current.style = `transform: rotate(${angle -
      compassInitialRotation}deg); display:inline-block;`;
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="fd-section center"
      style={{ width: '100vw', height: '100vh' }}
    >
      <Panel>
        <Panel.Header>
          <Panel.Head title="Welcome to the Compass UI" />

          <Panel.Actions>
            <span ref={rotatingCompass}>
              <Icon glyph="business-objects-explorer" size="xl" />
            </span>
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body>
          <img alt="Compass logo" src="compass-logo.png" />
        </Panel.Body>
      </Panel>
    </section>
  );
};

export default Overview;
