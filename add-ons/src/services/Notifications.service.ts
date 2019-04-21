import { useState, useEffect } from 'react';
import createContainer from 'constate';

import { Notification } from '../types';
import { NOTIFICATION_SHOW_TIME } from '../constants';

const useNotifications = () => {
  const [notification, setNotification] = useState<Notification>(
    {} as Notification,
  );
  const [showNotification, setShowNotification] = useState<boolean>(false);
  let timer: number = 0;

  useEffect(() => {
    if (!notification) return;
    if (!Object.keys(notification).length) return;

    setShowNotification(true);
    let timer = setTimeout(
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

  const successNotification = (
    title: string,
    content: string | React.ReactNode,
  ) => {
    setNotification({
      title: title,
      content: content,
      color: '#359c46',
      icon: 'accept',
    });
  };

  const errorNotification = (
    title: string,
    content: string | React.ReactNode,
  ) => {
    setNotification({
      title: title,
      content: content,
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

const { Provider, Context } = createContainer(useNotifications);
export { Provider as NotificationsProvider, Context as NotificationsService };
