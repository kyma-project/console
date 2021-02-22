import { createApplicationBinding } from '../createApplicationBinding';

describe('createApplicationBinding', () => {
  it('forms valid binding', () => {
    const application = { metadata: { name: 'test-application-name' } };
    const namespace = 'test-namespace';
    const services = ['service1', 'service2'];
    expect(
      createApplicationBinding(application, namespace, services),
    ).toMatchSnapshot();
  });
});
