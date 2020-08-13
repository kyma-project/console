import LuigiClient from '@luigi-project/client';

export function useWindowTitle(title) {
  LuigiClient.sendCustomMessage({ id: 'console.setWindowTitle', title });
}

export function withWindowTitle(title, component) {
  return () => {
    useWindowTitle(title);
    return component;
  };
}
