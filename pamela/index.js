const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
import npx from './npx-setup';
import { initializeKubeconfig } from './utils/kubeconfig';
import { initializeApp } from './utils/initialization';
import { requestLogger } from './utils/other';

npx.setupEnv();

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

    const handleBackendRequest = handleRequest(httpsAgent);
    if (npx.isNpxEnv()) {
      npx.setupRoutes(app, handleBackendRequest);
    } else {
      app.use(handleBackendRequest);
    }

    server.listen(port, address, () => {
      console.log(`👙 PAMELA 👄 server started @ ${port}!`);
      npx.openBrowser(port);
    });
  })
  .catch(err => {
    console.error('PANIC!', err);
    process.exit(1);
  });

const handleRequest = httpsAgent => async (req, res) => {
  delete req.headers.host; // remove host in order not to confuse APIServer

  const targetApiServer =
    req.headers['x-api-url'] && req.headers['x-api-url'] !== 'undefined'
      ? req.headers['x-api-url']
      : k8sUrl.hostname;
  delete req.headers['x-api-url'];

  const options = {
    hostname: targetApiServer,
    path: req.originalUrl.replace(/^\/backend/, ''),
    headers: req.headers,
    body: req.body,
    agent: httpsAgent,
    method: req.method,
    port: k8sUrl.port || 443,
  };
  npx.adjustRequestOptions(options, kubeconfig);

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
