import { TestBed, inject } from '@angular/core/testing';

import { TriggersService } from './triggers.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../app.config';

describe('TriggersService', () => {
  let triggersService: TriggersService;
  let httpClientMock: HttpTestingController;
  // const name = 'fakesub';
  // const namespace = 'fakeNamespace';
  // const token = 'fakeToken';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TriggersService]
    });
    triggersService = TestBed.get(TriggersService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([TriggersService], (service: TriggersService) => {
    expect(service).toBeTruthy();
  }));

  const response = {};

  // it('should get subscriptions', (done) => {
  //   const params = {};
  //   subscriptionsService.getSubscriptions(namespace, token, params).subscribe((res) => {
  //     done();
  //   });
  //   const request = httpClientMock.expectOne(
  //     `${AppConfig.subscriptionApiUrl}/namespaces/${namespace}/subscriptions`
  //   );
  //   request.flush(response);
  //   expect(request.request.method).toEqual('GET');
  //   expect(request.request.headers.get('Content-type')).toEqual('application/json');
  //   expect(request.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
  //   httpClientMock.verify();
  // });

  // it('should delete subscriptions', (done) => {
  //   const params = {};
  //   subscriptionsService.deleteSubscription(name, namespace, token).subscribe((res) => {
  //     done();
  //   });
  //   const request = httpClientMock.expectOne(
  //     `${AppConfig.subscriptionApiUrl}/namespaces/${namespace}/subscriptions/${name}`
  //   );
  //   request.flush(response);
  //   expect(request.request.method).toEqual('DELETE');
  //   expect(request.request.headers.get('Content-type')).toEqual('application/json');
  //   expect(request.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
  //   httpClientMock.verify();
  // });
});
