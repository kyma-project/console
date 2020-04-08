import { filterServiceInstances } from '../filterServiceInstances';

describe('filterServiceInstances', () => {
  it('Should filter properly Service Instances', () => {
    const serviceInstance_1 = {
      name: 'serviceInstance_1',
      bindable: true,
    };
    const serviceInstance_2 = {
      name: 'serviceInstance_2',
      bindable: true,
    };
    const serviceInstance_3 = {
      name: 'serviceInstance_3',
      bindable: false,
    };
    const serviceInstances = [
      serviceInstance_1,
      serviceInstance_2,
      serviceInstance_3,
    ];

    const serviceBindingUsage_1 = {
      serviceBinding: {
        serviceInstanceName: 'serviceInstance_1',
      },
    };
    const serviceBindingUsage_2 = {
      serviceBinding: {
        serviceInstanceName: 'serviceInstance_4',
      },
    };
    const serviceBindingUsages = [serviceBindingUsage_1, serviceBindingUsage_2];

    const notInjectedServiceInstances = filterServiceInstances(
      serviceInstances,
      serviceBindingUsages,
    );

    expect(JSON.stringify(notInjectedServiceInstances)).toBe(
      JSON.stringify([serviceInstance_2]),
    );
  });
});
