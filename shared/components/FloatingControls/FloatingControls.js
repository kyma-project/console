import React, { useReducer, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import './FloatingControls.scss';
import { is } from '@babel/types';

export const FloatingControls = ({ children }) => {
  const controlsRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(true);

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /*or $(window).height() */ &&
      rect.right <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  useEffect(() => {
    if (controlsRef && controlsRef.current) {
      // console.log('adding listener');
      document.onscroll = e => {
        const isCurrentlyInViewport = isElementInViewport(controlsRef.current);

        if (isCurrentlyInViewport !== isInViewport) {
          console.log(isCurrentlyInViewport, isInViewport);
          setIsInViewport(isCurrentlyInViewport);
        }
      };
    }
  }, [controlsRef, isInViewport, setIsInViewport, isElementInViewport]);

  return (
    <div className="floating-controls" ref={controlsRef}>
      <div
        className={classNames(['movable-container', { bottom: !isInViewport }])}
      >
        {children}
      </div>
    </div>
  );
};
