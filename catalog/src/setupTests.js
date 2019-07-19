//Do not move this file to another location. It will cause tests to stop working.

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
crypto = require('@trust/webcrypto');
Enzyme.configure({ adapter: new Adapter() });
