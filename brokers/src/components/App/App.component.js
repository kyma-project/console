import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Modal, Notification } from '@kyma-project/react-components';
import ServiceBrokers from '../ServiceBrokers/ServiceBrokers.container';

Modal.MODAL_APP_REF = '#root';
const NOTIFICATION_VISIBILITY_TIME = 5000;

class App extends React.Component {
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

  render() {
    const notificationQuery = this.props.notification;
    const notification = notificationQuery && notificationQuery.notification;
    if (notification) {
      this.scheduleClearNotification();
    }

    return (
      <div>
        <Notification {...notification} onClick={this.clearNotification} />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={ServiceBrokers} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
