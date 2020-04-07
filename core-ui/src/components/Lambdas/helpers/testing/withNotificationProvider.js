import React from 'react';
import { NotificationProvider } from 'react-shared';

export function withNotificationProvider({ component = null }) {
  return (
    <NotificationProvider defaultVisibilityTime={0}>
      {component}
    </NotificationProvider>
  );
}
