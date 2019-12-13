import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Notification } from '@kyma-project/react-components';

import './App.scss';
import Overview from './components/Overview/Overview';
import Runtimes from './components/Runtimes/Runtimes.container';
import RuntimeDetails from './components/Runtimes/RuntimeDetails/RuntimeDetails.container';
import Applications from './components/Applications/Applications.container';
import EditApi from 'components/Api/EditApi/EditApi.container';
import EditEventApi from 'components/Api/EditEventApi/EditEventApi.container';
import Scenarios from './components/Scenarios/Scenarios.container';
import ScenarioDetails from './components/Scenarios/ScenarioDetails/ScenarioDetails';
import ApplicationDetails from './components/Application/ApplicationDetails/ApplicationDetails.container';
import MetadataDefinitions from './components/MetadataDefinitions/MetadataDefinitions.container';
import MetadataDefinitionDetails from './components/MetadataDefinitions/MetadataDefinitionDetails/MetadataDefinitionDetails.container';
import ApiDetails from './components/Api/ApiDetails/ApiDetails.container';

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
          <Switch>
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
            <Route
              path="/application/:applicationId/api/:apiId"
              exact
              render={RoutedApiDetails}
            />
            <Route
              path="/application/:applicationId/api/:apiId/edit"
              exact
              render={RoutedEditApi}
            />
            <Route
              path="/application/:applicationId/eventApi/:eventApiId"
              exact
              render={RoutedEventApiDetails}
            />
            <Route
              path="/application/:applicationId/eventApi/:eventApiId/edit"
              exact
              render={RoutedEditEventApi}
            />
            <Route path="/scenarios" exact component={Scenarios} />
            <Route
              path="/scenarios/:scenarioName"
              exact
              render={RoutedScenarioDetails}
            />
            <Route
              path="/metadata-definitions"
              exact
              component={MetadataDefinitions}
            />
            <Route
              path="/metadatadefinition/:definitionKey"
              exact
              render={RoutedMetadataDefinitionDetails}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

function RoutedApiDetails({ match }) {
  return (
    <ApiDetails
      applicationId={match.params.applicationId}
      apiId={match.params.apiId}
    />
  );
}

function RoutedEditApi({ match }) {
  return (
    <EditApi
      apiId={match.params.apiId}
      applicationId={match.params.applicationId}
    />
  );
}

function RoutedEventApiDetails({ match }) {
  return (
    <ApiDetails
      applicationId={match.params.applicationId}
      eventApiId={match.params.eventApiId}
    />
  );
}

function RoutedEditEventApi({ match }) {
  return (
    <EditEventApi
      eventApiId={match.params.eventApiId}
      applicationId={match.params.applicationId}
    />
  );
}

function RoutedMetadataDefinitionDetails({ match }) {
  return (
    <MetadataDefinitionDetails
      definitionKey={decodeURIComponent(match.params.definitionKey)}
    />
  );
}

function RoutedScenarioDetails({ match }) {
  return <ScenarioDetails scenarioName={match.params.scenarioName} />;
}

export default App;
