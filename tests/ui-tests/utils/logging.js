import util from 'util';
import config from '../config';

let counter = 0;

module.exports = function(page, callback) {
  //reacts on page crush
  page.on('error', msg => {
    console.log(util.inspect(msg, { depth: 3 }));
  });

  //reacts when an uncaught exception happens within the page.
  page.on('pageerror', msg => {
    console.log(util.inspect(msg, { depth: 3 }));
  });

  page.on('request', request => {
    if (
      request._headers &&
      request._headers.authorization &&
      request._headers.authorization.indexOf('undefined') === -1 &&
      0 === counter
    ) {
      counter = counter + 1;
      if (config.verbose) {
        console.log(request._headers.authorization);
      }
      if (typeof callback === 'function') {
        callback(request._headers.authorization);
      }
    }
  });

  //reacts on failed requests, like time outs
  page.on('requestfailed', request => {
    console.log(
      `Request ${request._method} ${request._url} failed with message : ${request._failureText}`,
    );
  });

  if (config.verbose) {
    //reacts when JavaScript within the page calls one of console API methods, e.g. console.log or console.dir. Also emitted if the page throws an error or a warning.
    page.on('console', msg => {
      console.log(util.inspect(msg, { depth: 3 }));
    });
  }
};
