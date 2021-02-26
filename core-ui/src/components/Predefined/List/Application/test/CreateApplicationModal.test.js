import { createApplicationInput } from '../CreateApplicationModal';

describe('createApplicationInput', () => {
  it('forms valid application input', () => {
    const input = {
      name: 'test-app-name',
      description: 'test-description',
      labels: { a: 'b', c: 'd', d: 'e', e: 'f' },
    };
    expect(createApplicationInput(input)).toMatchSnapshot();
  });
});
