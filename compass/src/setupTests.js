import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

var nodeCrypto = require('crypto');
global.crypto = {
  getRandomValues: function(buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};
Enzyme.configure({ adapter: new Adapter() });
