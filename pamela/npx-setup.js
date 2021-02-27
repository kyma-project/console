const path = require('path');
const open = require('open');
const express = require('express');

export function setupEnv() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

export function setupRoutes(app, handleBackendRequest) {
  app.use('/core-ui', express.static(path.join(__dirname, 'core-ui')));
  app.get('/core-ui/*', (_, res) =>
    res.sendFile(path.join(__dirname + '/core-ui/index.html')),
  );

  app.use('/home', (_, res) => res.redirect('/core'));

  app.use('/backend', handleBackendRequest);

  app.use('/', express.static(path.join(__dirname, 'core')));
  app.get('/*', (_, res) =>
    res.sendFile(path.join(__dirname + '/core/index.html')),
  );
}

export function openBrowser(port) {
  open(`http://localhost:${port}/`);
}

export function adjustRequestOptions(options, kubeconfig) {
  options.headers = {
    ...options.headers,
    authorization: `Bearer ${kubeconfig.users[0].token}`,
  };
}
