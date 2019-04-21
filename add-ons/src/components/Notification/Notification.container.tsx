import React, { useContext } from 'react';

import { NotificationsService } from '../../services';

import Notification from './Notification.component';

const NotificationContainer: React.FunctionComponent = () => {
  const { notification, showNotification, hideNotification } = useContext(
    NotificationsService,
  );

  return (
    <Notification
      notification={notification}
      showNotification={showNotification}
      hideNotification={hideNotification}
    />
  );
};

export default NotificationContainer;
