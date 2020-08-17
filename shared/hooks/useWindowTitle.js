import React from 'react';
import LuigiClient from '@luigi-project/client';
import { useEffect } from 'react';

export function setWindowTitle(title) {
  setImmediate(() =>
    LuigiClient.sendCustomMessage({ id: 'console.setWindowTitle', title }),
  );
}

export function useWindowTitle(title) {
  useEffect(() => setWindowTitle(title), [title]);
}

export function withTitle(title, Component) {
  return props => {
    setWindowTitle(title);
    return <Component {...props} />;
  };
}
