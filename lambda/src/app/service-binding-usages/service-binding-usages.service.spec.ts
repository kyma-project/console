import { TestBed, inject } from '@angular/core/testing';

import { ServiceBindingUsagesService } from './service-binding-usages.service';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfig } from '../app.config';
import {
  ServiceBindingUsage,
  IServiceBindingUsageSpec,
  ILocalReferenceByKindAndName,
  ILocalReferenceByName,
  ILocalEnvPrefix,
  ILocalParams,
} from '../shared/datamodel/k8s/service-binding-usage';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';

describe('ServiceBindingUsagesService', () => {
  let serviceBindingUsagesService: ServiceBindingUsagesService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceBindingUsagesService],
    });

    serviceBindingUsagesService = TestBed.get(ServiceBindingUsagesService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should get all the Service Binding Usages', done => {
    const name = 'fakeServiceBindingName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    serviceBindingUsagesService
      .getServiceBindingUsages(namespace, token)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(
      `${
        AppConfig.serviceBindingUsageUrl
      }/namespaces/${namespace}/servicebindingusages`,
    );
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });

  it('should create the Service Binding', done => {
    const md: IMetaData = {
      name: '',
      namespace: 'fakeNamespace',
    };
    const sbName: ILocalReferenceByName = {
      name: '',
    };
    const ub: ILocalReferenceByKindAndName = {
      name: '',
      kind: '',
    };
    const prefix: ILocalEnvPrefix = {
      name: '',
    };
    const params: ILocalParams = {
      envPrefix: prefix,
    };
    const sp: IServiceBindingUsageSpec = {
      serviceBindingRef: sbName,
      usedBy: ub,
      parameters: params,
    };
    const fakeServiceBindingUsage = new ServiceBindingUsage({
      kind: 'ServiceBindingUsage',
      apiVersion: 'servicecatalog.ysf.io/v1alpha1',
      metadata: md,
      spec: sp,
    });
    const token = 'fakeToken';
    serviceBindingUsagesService
      .createServiceBindingUsage(fakeServiceBindingUsage, token)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(
      `${AppConfig.serviceBindingUsageUrl}/namespaces/${
        fakeServiceBindingUsage.metadata.namespace
      }/servicebindingusages`,
    );
    expect(req.request.method).toEqual('POST');
    req.flush({});
    httpClientMock.verify();
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });

  it('should delete the Service Binding', done => {
    const name = 'fakeServiceBindingUsageName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    serviceBindingUsagesService
      .deleteServiceBindingUsage(name, namespace, token)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(
      `${
        AppConfig.serviceBindingUsageUrl
      }/namespaces/${namespace}/servicebindingusages/${name}`,
    );
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });
});
