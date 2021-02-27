#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const path = require('path');
import { initializeKubeconfig } from './utils/kubeconfig';
import { initializeApp } from './utils/initialization';
import { requestLogger } from './utils/other';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express();
app.use(express.raw({ type: '*/*' }));
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: '*' }));
}

const server = http.createServer(app);
const kubeconfig = initializeKubeconfig();
const k8sUrl = new URL(kubeconfig.getCurrentCluster().server);

// requestLogger(require("http")); //uncomment this to log the outgoing traffic
// requestLogger(require("https")); //uncomment this to log the outgoing traffic

const port = process.env.PORT || 3001;
const address = process.env.ADDRESS || 'localhost';
console.log(`K8s server used: ${k8sUrl}`);

initializeApp(app, kubeconfig)
  .then(_ => {
    const httpsAgent = app.get('https_agent');
    app.use('/core-ui', express.static(path.join(__dirname, 'core-ui')));
    app.get('/core-ui/*', (_, res) =>
      res.sendFile(path.join(__dirname + '/core-ui/index.html')),
    );

    app.use('/home', (_, res) => res.redirect('/core'));
    app.use('/core', express.static(path.join(__dirname, 'core')));
    app.get('/core/*', (_, res) =>
      res.sendFile(path.join(__dirname + '/core/index.html')),
    );
    app.use('/backend', handleRequest(httpsAgent));
    // app.get('/', (_, res) => res.redirect('/core'));
    server.listen(port, address, () => {
      console.log(`👙 PAMELA 👄 server started @ ${port}!`);
    });
  })
  .catch(err => {
    console.error('PANIC!', err);
    process.exit(1);
  });

const handleRequest = httpsAgent => async (req, res) => {
  delete req.headers.host; // remove host in order not to confuse APIServer

  const targetApiServer = req.headers['x-api-url'];
  delete req.headers['x-api-url'];
  req.headers.authorization = `Bearer ${kubeconfig.users[0].token}`;
  const options = {
    hostname: k8sUrl.hostname,
    path: req.originalUrl.replace(/\/backend/, ''),
    headers: req.headers,
    body: req.body,
    agent: httpsAgent,
    method: req.method,
  };

  const k8sRequest = https
    .request(options, function(k8sResponse) {
      res.writeHead(k8sResponse.statusCode, {
        'Content-Type': k8sResponse.headers['Content-Type'] || 'text/json',
        'Content-Encoding': k8sResponse.headers['content-encoding'] || '',
      });

      k8sResponse.pipe(res);
    })
    .on('error', function(err) {
      console.error('Internal server error thrown', err);
      res.statusMessage = 'Internal server error';
      res.statusCode = 500;
      res.end(Buffer.from(JSON.stringify({ message: err })));
    });

  k8sRequest.end(Buffer.isBuffer(req.body) ? req.body : undefined);
  req.pipe(k8sRequest);
};
