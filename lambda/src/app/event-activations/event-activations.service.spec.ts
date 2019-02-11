import { TestBed, inject } from '@angular/core/testing';

import { EventActivationsService } from './event-activations.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfig } from '../app.config';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';

describe('EventActivationsService', () => {
  let eventActivationsService: EventActivationsService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventActivationsService, GraphqlClientService],
    });
    eventActivationsService = TestBed.get(EventActivationsService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject(
    [EventActivationsService],
    (service: EventActivationsService) => {
      expect(service).toBeTruthy();
    },
  ));

  it('should get eventActivations', done => {
    const name = 'fakeApiName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    const expectedQuery = `query EventActivations($namespace: String!) {
      eventActivations(namespace: $namespace) {
        name
        displayName
        sourceId
        events {
          eventType
          version
          description
        }
      }
    }`;
    eventActivationsService
      .getEventActivations(namespace, token)
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

  it('should handle empty eventActivations list', done => {
    const name = 'fakeApiName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    eventActivationsService
      .getEventActivations(namespace, token)
      .subscribe(res => {
        done();
        expect(res.data.eventActivations.length).toEqual(0);
      });
    const httpMock = httpClientMock.expectOne(`${AppConfig.graphqlApiUrl}`);
    httpMock.flush({ data: { eventActivations: [] } });
    expect(httpMock.request.method).toEqual('POST');
  });
});
