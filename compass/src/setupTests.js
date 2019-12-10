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

window.postMessage = jest.fn();

// fix UnhandledPromiseRejectionWarning: TypeError: document.createRange is not a function
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

Enzyme.configure({ adapter: new Adapter() });
