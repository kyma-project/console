import { TestBed, inject } from '@angular/core/testing';

import { TriggersService } from './triggers.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../app.config';

describe('TriggersService', () => {
  let triggersService: TriggersService;
  let httpClientMock: HttpTestingController;
  const name = 'fakeTrigger';
  const namespace = 'fakeNamespace';
  const token = 'fakeToken';

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

  it('should create trigger', (done) => {
    const trigger = triggersService.initializeTrigger()
    trigger.metadata['name'] = name;
    trigger.metadata['namespace'] = namespace;    
    triggersService.createTrigger(trigger, token).subscribe((res) => {
      done();
    });
    const request = httpClientMock.expectOne(
      `${AppConfig.triggerApiUrl}/namespaces/${namespace}/triggers`
    );
    request.flush(response);
    expect(request.request.method).toEqual('POST');
    expect(request.request.headers.get('Content-type')).toEqual('application/json');
    expect(request.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
    expect(request.request.body).toEqual(trigger)
    httpClientMock.verify();
  });

  it('should delete trigger', (done) => {
    triggersService.deleteTrigger(name, namespace, token).subscribe((res) => {
      done();
    });
    const request = httpClientMock.expectOne(
      `${AppConfig.triggerApiUrl}/namespaces/${namespace}/triggers/${name}`
    );
    request.flush(response);
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.headers.get('Content-type')).toEqual('application/json');
    expect(request.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
    httpClientMock.verify();
  });
});
