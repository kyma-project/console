import { TestBed, inject } from '@angular/core/testing';

import { ContainerInstancesService } from './container-instances.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfig } from '../app.config';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';

describe('ContainerInstancesService', () => {
  let containerInstancesService: ContainerInstancesService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContainerInstancesService, GraphqlClientService],
    });
    containerInstancesService = TestBed.get(ContainerInstancesService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject(
    [ContainerInstancesService],
    (service: ContainerInstancesService) => {
      expect(service).toBeTruthy();
    },
  ));

  it('should get Pod list', done => {
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    const expectedQuery = `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        creationTimestamp
        labels
      }
    }`;
    containerInstancesService
      .getContainerInstances(namespace, token)
      .subscribe(res => {
        done();
      });
    const request = httpClientMock.expectOne(`${AppConfig.graphqlApiUrl}`);
    request.flush({});
    expect(request.request.method).toEqual('POST');
    expect(request.request.body.query.indexOf(expectedQuery)).toBe(0);
    expect(request.request.headers.get('Content-type')).toEqual(
      'application/json',
    );
    expect(request.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
    httpClientMock.verify();
  });

  it('should handle empty Pod list', done => {
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    containerInstancesService
      .getContainerInstances(namespace, token)
      .subscribe(res => {
        done();
        expect(res.data.pods.length).toEqual(0);
      });
    const httpMock = httpClientMock.expectOne(`${AppConfig.graphqlApiUrl}`);
    httpMock.flush({ data: { pods: [] } });
    expect(httpMock.request.method).toEqual('POST');
  });
});
