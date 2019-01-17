import { ServiceInstance } from './service-instance';

export class ServiceInstancesResponse {
  data: {
    serviceInstances: ServiceInstance[];
  };
}
