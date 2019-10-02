import React from 'react';
import NotificationContext from '../../../../contexts/NotificationContext/NotificationContext';

export default function WithContext(Component, props) {
  return (
    <NotificationContext.Consumer>
      {notification => <Component {...props} notification={notification} />}
    </NotificationContext.Consumer>
  );
}
