import React from 'react';

export const ApiReferencePlugin = function(system) {
  return {
    wrapComponents: {
      parameters: (Original, system) => props => {
        const allowTryItOut = false;
        const customProps = { ...props, allowTryItOut };

        return <Original {...customProps} />;
      },
      authorizeBtn: (Original, system) => props => {
        return <div />;
      },
      info: (Original, system) => props => {
        return <div />;
      },
    },
  };
};

export const ApiConsolePlugin = function(system) {
  return {
    wrapComponents: {
      authorizeBtn: (Original, system) => props => {
        return <div />;
      },
      info: (Original, system) => props => {
        return <div />;
      },
    },
  };
};
