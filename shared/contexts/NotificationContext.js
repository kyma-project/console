import React, { createContext, useContext, useState } from 'react';
import { Notification } from '../components/Notification/Notification';

export const NotificationContext = createContext({
  isOpen: false,
  notify: () => {},
  notifySuccess: () => {},
  notifyError: () => {},
});

export const NotificationProvider = ({
  children,
  defaultVisibilityTime = 5000,
  defaultErrorVisibilityTime = 10000,
}) => {
  const [state, setState] = useState({
    isOpen: false,
  });

  function notify(notificationProps, visibilityTime = defaultVisibilityTime) {
    setState({ isOpen: true, notificationProps });
    if (notificationProps.autoClose && visibilityTime !== 0) {
      setTimeout(() => {
        closeNotification();
      }, visibilityTime);
    }
  }

  const methods = {
    notify,
    notifySuccess: function(
      notificationProps,
      visibilityTime = defaultVisibilityTime,
    ) {
      notificationProps = {
        title: 'Success',
        type: 'success',
        icon: 'accept',
        autoClose: true,
        ...notificationProps,
      };
      notify(notificationProps, visibilityTime);
    },
    notifyWarning: function(
      notificationProps,
      visibilityTime = defaultErrorVisibilityTime,
    ) {
      notificationProps = {
        title: 'Warning',
        type: 'warning',
        icon: 'warning',
        autoClose: true,
        ...notificationProps,
      };
      notify(notificationProps, visibilityTime);
    },
    notifyError: function(
      notificationProps,
      visibilityTime = defaultErrorVisibilityTime,
    ) {
      notificationProps = {
        title: 'Error',
        type: 'error',
        icon: 'decline',
        autoClose: true,
        ...notificationProps,
      };
      notify(notificationProps, visibilityTime);
    },
  };

  const closeNotification = () => {
    setState({ isOpen: false });
  };

  return (
    <NotificationContext.Provider
      value={{
        isOpen: state.isOpen,
        ...methods,
      }}
    >
      {state.isOpen && (
        <Notification
          visible={true}
          {...state.notificationProps}
          onClick={closeNotification}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  return useContext(NotificationContext);
}
