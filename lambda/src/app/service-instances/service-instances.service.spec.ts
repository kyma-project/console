import { TestBed, inject } from '@angular/core/testing';

import { ServiceInstancesService } from './service-instances.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfig } from '../app.config';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';

describe('ServiceInstancesService', () => {
  let serviceInstanceService: ServiceInstancesService;
  let httpClientMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceInstancesService, GraphqlClientService],
    });

    serviceInstanceService = TestBed.get(ServiceInstancesService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should get service instance', done => {
    const name = 'fakeServiceInstanceName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    const expectedQuery = `query ServiceInstance($name: String!, $environment: String!){
      serviceInstance(name: $name, environment: $environment) {
        name,
        bindable
      }}`;

    serviceInstanceService
      .getServiceInstance(name, namespace, token)
      .subscribe(res => {
        done();
      });

    const req = httpClientMock.expectOne(`${AppConfig.graphqlApiUrl}`);
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.query.indexOf(expectedQuery)).toBe(0);
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });

  it('should get all the service instances', done => {
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    const status = 'RUNNING';

    const expectedQuery = `query ServiceInstances($environment: String!, $status: InstanceStatusType){
      serviceInstances(environment: $environment, status: $status) {
        name,
        bindable
      }}`;

    serviceInstanceService
      .getServiceInstances(namespace, token, status)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(`${AppConfig.graphqlApiUrl}`);
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.query.indexOf(expectedQuery)).toBe(0);
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });
});
