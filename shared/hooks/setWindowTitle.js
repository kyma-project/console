import LuigiClient from '@luigi-project/client';
import { useEffect } from 'react';

export function setWindowTitle(title) {
  useEffect(() => {
    console.log('setting window title to', title);
    LuigiClient.sendCustomMessage({ id: 'console.setWindowTitle', title });
  }, [title]);
}
