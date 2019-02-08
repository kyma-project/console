import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Modal, Notification, BackendModuleDisabled } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import MainPage from '../Main/Main.container';
import InstanceDetails from '../ServiceClassDetails/ServiceClassDetails.container';

import { NotificationLink } from './styled';

import { backendModuleExists } from '../../commons/helpers';

Modal.MODAL_APP_REF = '#root';
const NOTIFICATION_VISIBILITY_TIME = 5000;

class App extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    clearNotification: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.timeout = null;
  }

  scheduleClearNotification() {
    const { clearNotification } = this.props;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (typeof clearNotification === 'function') {
        clearNotification();
      }
    }, NOTIFICATION_VISIBILITY_TIME);
  }

  clearNotification = () => {
    clearTimeout(this.timeout);
    this.props.clearNotification();
  };

  goToServiceInstanceDetails = name => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-instances/details/${name}`);
  };

  render() {
    const notificationQuery = this.props.notification;
    const notification = notificationQuery && notificationQuery.notification;
    if (notification) {
      this.scheduleClearNotification();
    }

    return (
      <div>
        {notification && (
          <Notification
            {...notification}
            title={
              <NotificationLink
                data-e2e-id={`notification-${notification.type}`}
                onClick={() => {
                  this.goToServiceInstanceDetails(notification.instanceName);
                }}
              >
                {notification.title}
              </NotificationLink>
            }
            onClick={this.clearNotification}
          />
        )}
        <div className="ph3 pv1 background-gray">
          {backendModuleExists("servicecatalog") ? (
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route exact path="/details/:name" component={InstanceDetails} />
            </Switch>
          ) : (
            <BackendModuleDisabled mod="Service Catalog" />
          )}
        </div>
      </div>
    );
  }
}

export default App;