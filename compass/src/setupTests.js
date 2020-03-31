import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from '@testing-library/react';
import 'jsdom-worker-fix';
import '@testing-library/jest-dom/extend-expect';

global.INJECTED_CLUSTER_CONFIG = {};

var nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues: function(buffer) {
    return nodeCrypto.randomFillSync(Buffer.from(buffer));
  },
};
global.URL.createObjectURL = jest.fn();

global.wait = async (ms = 0) => {
  await act(() => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  });
};

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
