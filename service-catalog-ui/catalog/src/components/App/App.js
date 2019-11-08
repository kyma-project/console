import React, { useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import {
  Modal,
  Notification,
  BackendModuleDisabled,
} from '@kyma-project/react-components';
import NotificationContext from '../../contexts/NotificationContext/NotificationContext';
import LuigiClient from '@kyma-project/luigi-client';

import ServiceClassList from '../ServiceClassList/ServiceClassList.component';
import ServiceClassDetails from '../ServiceClassDetails/ServiceClassDetails.component';

import { backendModuleExists } from '../../commons/helpers';

Modal.MODAL_APP_REF = '#root';
const NOTIFICATION_VISIBILITY_TIME = 5000;

export default function App() {
  const [notificationData, setNotificationData] = useState({
    isOpen: false,
    data: {},
  });

  const goToServiceInstanceDetails = name => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-instances/details/${name}`);
  };

  return (
    // <NotificationContext.Provider
    //   value={{
    //     notificationData,
    //     open: function(notificationData) {
    //       setNotificationData({ isOpen: true, data: notificationData });
    //       setTimeout(() => {
    //         setNotificationData({ isOpen: false });
    //       }, NOTIFICATION_VISIBILITY_TIME);
    //     },
    //   }}
    // >
    //   {notificationData.isOpen ? (
    //     <Notification
    //       {...notificationData.data}
    //       onClick={() => {
    //         setNotificationData({ isOpen: false });
    //         goToServiceInstanceDetails(notificationData.data.instanceName);
    //       }}
    //     />
    //   ) : null}

    <div className="ph3 pv1 background-gray">
      {backendModuleExists('servicecatalog') ? (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={ServiceClassList} />
            <Route
              exact
              path="/details/:name"
              component={ServiceClassDetails}
            />
          </Switch>
        </BrowserRouter>
      ) : (
        <BackendModuleDisabled mod="Service Catalog" />
      )}
    </div>
    //   </NotificationContext.Provider>
  );
}
