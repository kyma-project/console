import React, { useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { Notification } from '@kyma-project/react-components';

import NotificationContext from '../../contexts/NotificationContext/NotificationContext';

import ServiceInstanceDetails from '../ServiceInstanceDetails/ServiceInstanceDetails';
import ServiceInstancesList from '../ServiceInstancesList/ServiceInstancesList';

const NOTIFICATION_VISIBILITY_TIME = 35000;

export default function App() {
  const [notificationData, setNotificationData] = useState({
    isOpen: false,
    data: {},
  });

  return (
    <NotificationContext.Provider
      value={{
        notificationData,
        open: function(notificationData) {
          setNotificationData({ isOpen: true, data: notificationData });
          setTimeout(() => {
            setNotificationData({ isOpen: false });
          }, NOTIFICATION_VISIBILITY_TIME);
        },
      }}
    >
      {notificationData.isOpen ? (
        <Notification
          {...notificationData.data}
          onClick={() => {
            setNotificationData({ isOpen: false });
          }}
        />
      ) : null}
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ServiceInstancesList} />
          <Route
            exact
            path="/details/:name"
            component={ServiceInstanceDetails}
          />
        </Switch>
      </BrowserRouter>
    </NotificationContext.Provider>
  );
}
