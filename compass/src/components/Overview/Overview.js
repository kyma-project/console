import React, { useRef } from "react";
import "./Overview.scss";
import { Panel } from "fundamental-react/lib/Panel";

const Overview = () => {
  const compassInitialRotation = 46;
  const rotatingCompass = useRef(null);

  const handleMouseMove = e => {
    const compassRect = rotatingCompass.current.getBoundingClientRect();
    const compassCenter = {
      x: compassRect.x + compassRect.width / 2,
      y: compassRect.y + compassRect.height / 2
    };
    const angle = Math.atan2(e.clientX - compassCenter.x, -(e.clientY - compassCenter.y)) * (180 / Math.PI);

    rotatingCompass.current.style = `transform: rotate(${angle - compassInitialRotation}deg);`;
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="fd-section flex-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Panel>
        <Panel.Header>
          <Panel.Head title="Welcome to the Compass UI" />
        </Panel.Header>
        <Panel.Body>
          <div className="logo">
            <img alt="Compass logo" src="compass-background.png" />
            <img alt="Compass neddle" className="neddle" ref={rotatingCompass} src="compass-neddle.png" />
          </div>
        </Panel.Body>
      </Panel>
    </section>
  );
};

export default Overview;
