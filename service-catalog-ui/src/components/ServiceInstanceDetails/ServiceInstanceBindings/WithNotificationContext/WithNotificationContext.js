import React from 'react';
import { NotificationContext } from 'react-shared';

export default function WithNotificationContext(Component, props) {
  return (
    <NotificationContext.Consumer>
      {notification => <Component {...props} notification={notification} />}
    </NotificationContext.Consumer>
  );
}
