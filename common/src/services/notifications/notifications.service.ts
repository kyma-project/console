import { useState, useEffect } from 'react';
import createUseContext from 'constate';

import { Notification, NotificationArgs } from './notifications.types';

const NOTIFICATION_SHOW_TIME = 5000;

const useNotifications = () => {
  const [notification, setNotification] = useState<Notification>(
    {} as Notification,
  );
  const [showNotification, setShowNotification] = useState<boolean>(false);
  let timer: any = 0;

  useEffect(() => {
    if (!notification || !Object.keys(notification).length) {
      return;
    }

    setShowNotification(true);
    timer = setTimeout(
      () => setShowNotification(false),
      NOTIFICATION_SHOW_TIME,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [notification]);

  const hideNotification = () => {
    setShowNotification(false);
    clearTimeout(timer);
  };

  const successNotification = ({ title, content }: NotificationArgs) => {
    setNotification({
      title,
      content,
      color: '#359c46',
      icon: 'accept',
    });
  };

  const errorNotification = ({ title, content }: NotificationArgs) => {
    setNotification({
      title,
      content,
      color: '#359c46',
      icon: 'accept',
    });
  };

  return {
    notification,
    showNotification,
    hideNotification,
    successNotification,
    errorNotification,
  };
};

const { Provider, Context } = createUseContext(useNotifications);
export { Provider as NotificationsProvider, Context as NotificationsService };
