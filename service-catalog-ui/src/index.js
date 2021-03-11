import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { preloadingStrategy } from '@kyma-project/common';
import './index.scss';
import { Microfrontend } from 'react-shared';

import App from 'components/App/App';

preloadingStrategy(async () => {
  ReactDOM.render(
    <Microfrontend env={process.env}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Microfrontend>,
    document.getElementById('root'),
  );
});
