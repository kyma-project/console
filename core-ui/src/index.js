import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { preloadingStrategy } from '@kyma-project/common';
import './index.scss';
import App from './components/App/App';
import { Microfrontend } from 'react-shared';

preloadingStrategy(async () => {
  ReactDOM.render(
    <Microfrontend env={process.env}>
      <BrowserRouter basename="/core-ui">
        <App />
      </BrowserRouter>
    </Microfrontend>,
    document.getElementById('root'),
  );
});
