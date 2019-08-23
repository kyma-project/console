import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CatalogViewContent from './components/App/CatalogViewContent.component';

import './index.css';

function Preload() {
  return <div></div>;
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/preload" component={Preload} />
      <Route component={CatalogViewContent} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
