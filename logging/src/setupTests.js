import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jsdom-worker-fix';
import toJson from 'enzyme-to-json';
import '@testing-library/jest-dom/extend-expect';

var nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues: function(buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};
global.URL.createObjectURL = jest.fn();

global.wait = require('waait');
global.toJson = toJson;

Enzyme.configure({ adapter: new Adapter() });

// fix UnhandledPromiseRejectionWarning: TypeError: document.createRange is not a function
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});
