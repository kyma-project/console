import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jsdom-worker-fix';

var nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues: function(buffer) {
    return nodeCrypto.randomFillSync(Buffer.from(buffer));
  },
};
global.URL.createObjectURL = jest.fn();

global.wait = require('waait');

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

window.postMessage = jest.fn();

Enzyme.configure({ adapter: new Adapter() });

export async function expectToSolveWithin(
  fnToCheck,
  maxTimeout,
  checkInterval = 100,
) {
  // tries to execute `fnToCheck` function without errors every `checkInteval` milliseconds.
  // If it doesn't succeeed untill `maxTimeout` milliseconds, it fails.

  // This function must be wrapped inside act() like following:
  // await act(async ()=>{ await expectToSolveWithin(...); });

  let getError = () => '';

  const timeoutPromise = new Promise((resolve, reject) =>
    setTimeout(function() {
      console.error('Assertion timeout exceeded');
      reject(getError());
    }, maxTimeout),
  );
  const expectAssertionsPromise = new Promise(async (resolve, reject) =>
    setInterval(() => {
      try {
        fnToCheck();
        resolve();
      } catch (e) {
        //
        //  error = e;
        getError = () => e;
      }
    }, checkInterval),
  );
  return Promise.race([timeoutPromise, expectAssertionsPromise]);
}
