const path = require('path');
const open = require('open');
const express = require('express');

function setupEnv() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

function setupRoutes(app, handleBackendRequest) {
  app.use('/core-ui', express.static(path.join(__dirname, 'core-ui')));
  app.get('/core-ui/*', (_, res) =>
    res.sendFile(path.join(__dirname + '/core-ui/index.html')),
  );

  app.use('/backend', handleBackendRequest);

  app.use('/', express.static(path.join(__dirname, 'core')));
  app.get('/*', (_, res) =>
    res.sendFile(path.join(__dirname + '/core/index.html')),
  );
}

function openBrowser(port) {
  open(`http://localhost:${port}/`);
}

function adjustRequestOptions(options, kubeconfig) {
  options.headers = {
    ...options.headers,
    authorization: `Bearer ${kubeconfig.users[0].token}`,
  };
}

function isNpxEnv() {
  return process.env.NODE_ENV === 'npx';
}

function runIfNpx(fn) {
  return (...args) => {
    if (isNpxEnv()) {
      fn(...args);
    }
  };
}

export default {
  setupEnv: runIfNpx(setupEnv),
  setupRoutes: runIfNpx(setupRoutes),
  openBrowser: runIfNpx(openBrowser),
  adjustRequestOptions: runIfNpx(adjustRequestOptions),
  isNpxEnv,
};
