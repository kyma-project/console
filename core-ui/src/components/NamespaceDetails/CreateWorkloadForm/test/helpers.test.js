import { formatDeployment, formatService } from '../helpers';

describe('CreateWorkloadForm helpers', () => {
  it('creates uploadable deployment', () => {
    const deployment = {
      name: 'test-name',
      namespace: 'test-namespace',
      createService: false,
      dockerImage: 'test-image',
      labels: { 'test-a': 'test-b' },
      requests: {
        memory: '60Mi',
        cpu: '51m',
      },
      limits: {
        memory: '128Mi',
        cpu: '1000m',
      },
    };

    const formatted = formatDeployment(deployment);

    expect(formatted).toMatchSnapshot();
  });

  it('creates uploadable service', () => {
    const deployment = {
      name: 'test-name',
      namespace: 'test-namespace',
      createService: false,
      dockerImage: 'test-image',
      labels: {},
      port: {
        name: 'http',
        port: 80,
        protocol: 'TCP',
        targetPort: 8080,
      },
    };

    const formatted = formatService(deployment, 'test-id');

    expect(formatted).toMatchSnapshot();
  });
});
