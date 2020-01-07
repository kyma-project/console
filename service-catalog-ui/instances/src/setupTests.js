import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues: function(buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

global.URL.createObjectURL = jest.fn();

global.wait = require('waait');

Enzyme.configure({ adapter: new Adapter() });
