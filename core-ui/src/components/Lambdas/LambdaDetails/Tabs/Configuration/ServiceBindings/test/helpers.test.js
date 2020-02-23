import { filterServiceInstances } from '../helpers';

describe('Service Bindings helpers - filterServiceInstances', () => {
  it('Should filter properly Service Instances', () => {
    const lambdaName = 'lambdaName';

    const serviceInstance_1 = {
      name: 'serviceInstance_1',
      bindable: true,
      status: {
        type: 'RUNNING',
      },
      serviceBindingUsages: [
        {
          usedBy: {
            name: lambdaName,
            kind: 'knative-service',
          },
        },
      ],
    };
    const serviceInstance_2 = {
      name: 'serviceInstance_2',
      bindable: true,
      status: {
        type: 'RUNNING',
      },
      serviceBindingUsages: [
        {
          usedBy: {
            name: 'foo-bar',
            kind: 'knative-service',
          },
        },
      ],
    };
    const serviceInstance_3 = {
      name: 'serviceInstance_3',
      bindable: true,
      status: {
        type: 'RUNNING',
      },
      serviceBindingUsages: [
        {
          usedBy: {
            name: 'foo-bar',
            kind: 'function',
          },
        },
      ],
    };
    const serviceInstance_4 = {
      name: 'serviceInstance_4',
      bindable: false,
      status: {
        type: 'RUNNING',
      },
    };
    const serviceInstance_5 = {
      name: 'serviceInstance_4',
      bindable: true,
      status: {
        type: 'FAILED',
      },
    };

    const serviceInstances = [
      serviceInstance_1,
      serviceInstance_2,
      serviceInstance_3,
      serviceInstance_4,
      serviceInstance_5,
    ];
    const injectedServiceInstances = [
      {
        serviceInstanceName: 'serviceInstance_1',
        bindingUsage: {
          usedBy: {
            name: lambdaName,
            kind: 'knative-service',
          },
        },
      },
    ];
    const notInjectedServiceInstances = [serviceInstance_2, serviceInstance_3];

    const [
      injectedServiceInstances_result,
      notInjectedServiceInstances_result,
    ] = filterServiceInstances(lambdaName, serviceInstances);

    expect(JSON.stringify(injectedServiceInstances_result)).toBe(
      JSON.stringify(injectedServiceInstances),
    );
    expect(JSON.stringify(notInjectedServiceInstances_result)).toBe(
      JSON.stringify(notInjectedServiceInstances),
    );
  });
});
