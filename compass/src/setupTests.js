import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jsdom-worker-fix';

var nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues: function(buffer) {
    return nodeCrypto.randomFillSync(new Buffer(buffer));
  },
};
global.URL.createObjectURL = jest.fn();

global.wait = require('waait');

Enzyme.configure({ adapter: new Adapter() });
