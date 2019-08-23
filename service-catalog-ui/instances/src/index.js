import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import InstancesViewContent from './components/App/InstancesViewContent.component';

import './index.css';

function Preload() {
  return <div></div>;
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/preload" component={Preload} />
      <Route component={InstancesViewContent} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
