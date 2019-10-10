import React, { createContext, useContext, useState } from 'react';
import { Notification } from '@kyma-project/react-components';

export const NotificationContext = createContext({
  isOpen: false,
  notify: () => {},
});

export const NotificationProvider = ({
  children,
  defaultVisibilityTime = 5000,
}) => {
  const [state, setState] = useState({
    isOpen: false,
  });

  const closeNotification = () => {
    setState({ isOpen: false });
  };

  return (
    <NotificationContext.Provider
      value={{
        isOpen: state.isOpen,
        notify: function(
          notificationProps,
          visibilityTime = defaultVisibilityTime,
        ) {
          setState({ isOpen: true, notificationProps });
          if (notificationProps.autoClose) {
            setTimeout(() => {
              closeNotification();
            }, visibilityTime);
          }
        },
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
