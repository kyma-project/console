import React, { createContext, useContext, useState } from 'react';
import { Notification } from '@kyma-project/react-components'; //TODO: use our own Notification

export const NotificationContext = createContext({
  isOpen: false,
  notify: () => {},
  notifySuccess: () => {},
  notifyError: () => {},
});

export const NotificationProvider = ({
  children,
  defaultVisibilityTime = 5000,
}) => {
  const [state, setState] = useState({
    isOpen: false,
  });

  function notify(notificationProps, visibilityTime = defaultVisibilityTime) {
    setState({ isOpen: true, notificationProps });
    if (notificationProps.autoClose) {
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
        color: '#107E3E',
        icon: 'accept',
        autoClose: true,
        ...notificationProps,
      };
      notify(notificationProps, visibilityTime);
    },
    notifyError: function(
      notificationProps,
      visibilityTime = defaultVisibilityTime,
    ) {
      notificationProps = {
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
        autoClose: false,
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
