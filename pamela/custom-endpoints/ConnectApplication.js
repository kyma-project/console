// NOTE
// Application connector may be only reachable inside the cluster

const http = require('http');

export function handleConnectApplicationRequest(req, res) {
  const { applicationName } = req.query;
  if (!applicationName) {
    res.status(400).send('Application name is required.');
    return;
  }

  if (!process.env.APPLICATION_CONNECTOR_URL) {
    res.status(500).send('Application connector url is not specified.');
    return;
  }

  const url = `${process.env.APPLICATION_CONNECTOR_URL}/v1/applications/tokens`;
  console.log(url);
  http
    .request(
      url,
      { method: 'POST', headers: { Application: applicationName } },
      response => {
        var str = '';
        response.on('data', function(chunk) {
          str += chunk;
        });

        response.on('end', function() {
          console.log(str);
          res.send('ok');
        });
      },
    )
    .end();

  // 	if resp.StatusCode != http.StatusCreated {
  // 		cause := svc.extractErrorCause(resp.Body)
  // 		return "", errors.Wrapf(cause, "while requesting connection URL obtained unexpected status code %d", resp.StatusCode)
  // 	}
}
