import React, { useContext } from 'react';

import NotificationsService from '../../services/Notifications.service';

import Notification from './component';

interface Props {}

export const Container: React.FunctionComponent<Props> = () => {
  const { notification, showNotification, hideNotification } = useContext(
    NotificationsService.Context,
  );

  return (
    <Notification
      notification={notification}
      showNotification={showNotification}
      hideNotification={hideNotification}
    />
  );
};

export default Container;
