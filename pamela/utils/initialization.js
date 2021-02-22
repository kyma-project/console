import https from 'https';
import fs from 'fs';

export async function initializeApp(app, kubeconfig) {
  app.set('token_cache', []);
  try {
    const caPath = kubeconfig.getCurrentCluster().caFile;
    if (!caPath) throw new Error('No certificate provided');

    const cert = fs.readFileSync(caPath, 'utf8');
    const sslConfiguredAgent = new https.Agent({
      ca: cert,
    });

    app.set('https_agent', sslConfiguredAgent); // cannot use http.globalAgent because it breaks the JWT library
    console.log('✔️  Setting up https HTTPS agent');
  } catch (e) {
    console.error(
      '❌ Setting up https HTTPS agent ended with error; an insecure connection will be used.',
    );
  }
}

async function retry(fn, times) {
  let lastError;
  while (times > 0) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      await wait(500);
      times--;
      console.log('Retries left:', times);
    }
  }
  throw new Error(lastError);
}

async function wait(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}
