import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AddonsViewContent from './core/AddonsViewContent';

import 'fiori-fundamentals/dist/fiori-fundamentals.min.css';

function Preload() {
  return <div />;
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact={true} path="/preload" component={Preload} />
      <Route component={AddonsViewContent} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
