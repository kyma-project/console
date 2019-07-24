import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Runtimes from './components/Runtimes/Runtimes.container';
import Overview from './components/Overview/Overview';
import RuntimeDetails from './components/Runtimes/RuntimeDetails/RuntimeDetails.component';
import ApplicationDetails from './components/Application/ApplicationDetails/ApplicationDetails.component';
import { Notification } from '@kyma-project/react-components';
import Applications from './components/Applications/Applications.container';

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
        <Router>
          <Route path="/" exact component={Overview} />
          <Route path="/runtimes" exact component={Runtimes} />
          <Route
            path="/runtime/:id"
            exact
            render={({ match }) => (
              <RuntimeDetails runtimeId={match.params.id} />
            )}
          />
          <Route path="/applications" exact component={Applications} />
          <Route
            path="/application/:id"
            exact
            render={({ match }) => (
              <ApplicationDetails applicationId={match.params.id} />
            )}
          />
        </Router>
      </div>
    );
  }
}

export default App;
