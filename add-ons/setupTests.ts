import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import nodeCrypto from 'crypto';

global.crypto = {
  getRandomValues: (buffer: string) =>
    nodeCrypto.randomFillSync(Buffer.from(buffer)),
};

Enzyme.configure({ adapter: new Adapter() });
