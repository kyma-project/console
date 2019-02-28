import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { BackendModuleDisabled } from '@kyma-project/react-components';

import MainPage from './components/MainPage/MainPage.container';

import { backendModuleExists } from './commons/helpers';

function App() {
  return (
    <div>
      <div className="ph3 pv1 background-gray">
        {backendModuleExists("content") ? (
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/:type/:id" component={MainPage} />
          </Switch>
        ) : (
          <BackendModuleDisabled mod="Content" />
        )}
      </div>
    </div>
  );
}

export default App;
